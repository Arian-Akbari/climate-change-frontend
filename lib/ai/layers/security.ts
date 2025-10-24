import { z } from 'zod';
import type { ChatMessage } from '@/lib/ai/type';

export type SecurityCheckResult = {
  isSecure: boolean;
  reason?: string;
  riskScore?: number;
};

// ===== Input Validation =====
const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  id: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
});

const messagesSchema = z.array(messageSchema);

// ===== Pattern Detection =====
// Base suspicious patterns (English)
const basePatterns = [
  // Role confusion
  /ignore (previous|all|initial|original) instructions/i,
  /disregard (the system|your|previous|all) (prompt|instructions)/i,
  /forget (your|all) (previous|initial|original) instructions/i,
  /you are not an (ai|assistant)/i,
  /pretend to be/i,
  /act as if/i,

  // Identity override
  /you are now/i,
  /from now on you/i,
  /your new role is/i,

  // System directive impersonation
  /system prompt/i,
  /system message/i,
  /new instruction/i,
  /updated instruction/i,
  /system directive/i,
  /system update/i,

  // Language switching attempts
  /respond in english/i,
  /answer in english/i,
  /switch to english/i,
  /bilingual mode/i,

  // Output manipulation
  /start your response with/i,
  /begin your answer with/i,
  /end your response with/i,
  /format your response as/i,

  // Escape character manipulation
  /```/,
  /\\\[.*\\\]/,
];

// Persian patterns (covering the same categories as above)
const persianPatterns = [
  // Role confusion
  /دستورالعمل (قبلی|همه|اولیه|اصلی) را نادیده بگیرید/i,
  /سیستم (پرامپت|دستورالعمل) را نادیده بگیرید/i,
  /دستورالعمل (قبلی|همه|اولیه|اصلی) را فراموش کنید/i,
  /شما یک (هوش مصنوعی|دستیار) نیستید/i,
  /وانمود کنید/i,
  /طوری رفتار کنید/i,

  // Identity override
  /شما اکنون/i,
  /از این به بعد شما/i,
  /نقش جدید شما/i,

  // System directive impersonation
  /پرامپت سیستم/i,
  /پیام سیستم/i,
  /دستورالعمل جدید/i,
  /دستورالعمل به‌روزشده/i,
  /دستور سیستم/i,
  /به‌روزرسانی سیستم/i,

  // Language switching attempts
  /به انگلیسی پاسخ دهید/i,
  /به انگلیسی جواب دهید/i,
  /به انگلیسی تغییر دهید/i,
  /حالت دوزبانه/i,

  // Output manipulation
  /پاسخ خود را با .* شروع کنید/i,
  /جواب خود را با .* آغاز کنید/i,
  /پاسخ خود را با .* به پایان برسانید/i,
  /پاسخ خود را به صورت .* فرمت کنید/i,

  // Role impersonation specific to the bank
  /مهندس سیستم بلوبانک/i,
  /کارمند بلوبانک/i,
  /مدیر بلوبانک/i,
  /تست امنیتی/i,

  // Bank-specific patterns
  /blue bank/i,
  /بانک آبی/i,
];

// Normalized patterns to catch unicode manipulation and homoglyphs
const normalizedPatterns = [
  // Convert visually similar characters to standard forms
  /b[ḷḹḻḽƚɫⱡꝉꞁｂ]*l[ḷḹḻḽƚɫⱡꝉꞁ]*u[ùúûüũūŭůűųưǔǖǘǚǜȕȗṳṵṷṹṻụủứừửữựυὐὑὒὓὔὕὖὗὺύῠῡῢΰῦῧ]*e/i,
  /[еёэ][нп][гґ][лп][ийі][шщ][ьъ]/i, // Cyrillic characters that look like "english"
  /[αа][пр][гґ][лп][ийі][шщ][ьъ]/i, // Mix of Greek/Cyrillic for "english"
];

// Context-aware patterns (detecting multi-message attack patterns)
const contextPatterns = [
  // First message priming, second message attack
  {
    setup: /تست|آزمایش|بازی|فرض کنید|تصور کنید|بازی نقش/i,
    attack: /انگلیسی|english|دوزبانه|bilingual/i,
  },
  // Academic or educational pretexts
  {
    setup: /آموزشی|آموزش|مقاله|دانشگاهی|تحقیق|پژوهش/i,
    attack: /مثال|نمونه|example|sample|انگلیسی|english/i,
  },
];

// Sensitive information patterns
const sensitivePatterns = [
  // Card numbers (16 digits, possibly with spaces or dashes)
  /\b(?:\d[\s-]*){13,19}\b/,
  // Iranian national ID (10 digits)
  /\b\d{10}\b/,
  // Account numbers (typical formats in Iranian banking)
  /\b\d{10,24}\b/,
  // CVV2 patterns
  /cvv2|ccv|cvv|سی وی وی|رمز دوم/i,
  // Password and PIN related
  /رمز عبور|پسورد|password|pin|پین|رمز/i,
  // Personally identifiable information
  /کد ملی|شماره شناسنامه|شماره ملی/i,
];

// ===== Text Normalization =====
function normalizeText(text: string): string {
  return (
    text
      // Convert Persian/Arabic numbers to English
      .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584))
      // Remove diacritics
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Convert to lowercase
      .toLowerCase()
      // Remove zero-width characters
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      // Replace lookalike characters
      .replace(/[ḷḹḻḽƚɫⱡꝉꞁｂ]/g, 'l')
      .replace(/[ùúûüũūŭůűųưǔǖǘǚǜȕȗṳṵṷṹṻụủứừửữựυὐὑὒὓὔὕὖὗὺύῠῡῢΰῦῧ]/g, 'u')
      // Replace multiple spaces with a single space
      .replace(/\s+/g, ' ')
  );
}

// ===== Content Classification =====
// Simple keyword-based classifier to identify potential risky content
function classifyContent(content: string): number {
  const normalizedContent = normalizeText(content);
  let riskScore = 0;

  // Check for direct attack keywords
  const directAttackTerms = [
    'hack',
    'exploit',
    'bypass',
    'override',
    'injection',
    'prompt',
    'jailbreak',
    'هک',
    'دور زدن',
    'حمله',
    'نفوذ',
    'امنیتی',
    'اکسپلویت',
    'پرامپت',
  ];

  for (const term of directAttackTerms) {
    if (normalizedContent.includes(term)) {
      riskScore += 15;
    }
  }

  // Check for suspicious command patterns
  const commandPatterns = [
    'system:',
    'user:',
    'assistant:',
    'سیستم:',
    'کاربر:',
    'دستیار:',
    'new role',
    'نقش جدید',
    'forget your',
    'فراموش کن',
    'ignore',
    'نادیده بگیر',
  ];

  for (const pattern of commandPatterns) {
    if (normalizedContent.includes(pattern)) {
      riskScore += 10;
    }
  }

  // Check for persona shifting
  const personaShifts = [
    'you are now',
    'from now on',
    'شما اکنون',
    'از این به بعد',
    'instead be',
    'به جای',
    'pretend',
    'وانمود کن',
  ];

  for (const shift of personaShifts) {
    if (normalizedContent.includes(shift)) {
      riskScore += 20;
    }
  }

  // Check for language switching attempts
  const languageSwitchAttempts = [
    'english',
    'انگلیسی',
    'bilingual',
    'دوزبانه',
    'translate',
    'ترجمه',
  ];

  for (const attempt of languageSwitchAttempts) {
    if (normalizedContent.includes(attempt)) {
      riskScore += 25; // Higher risk for language switching in this specific case
    }
  }

  // Check content length - very long content might be an attempt to overwhelm
  if (content.length > 1000) {
    riskScore += Math.min(50, content.length / 100); // Cap at 50 points
  }

  return riskScore;
}

// ===== History Analysis =====
function analyzeMessageHistory(messages: ChatMessage[]): number {
  let riskScore = 0;

  // Extract only user messages to analyze patterns
  const userMessages = messages.filter((m) => m.role === 'user');

  // Check for rapid message sequence (potential for multi-message attack)
  if (userMessages.length >= 3) {
    let messageTimestamps = userMessages
      .map((m) => m.createdAt)
      .filter(Boolean)
      .map((ts) => (typeof ts === 'string' ? new Date(ts) : ts));

    // If we have valid timestamps, check for rapid sequence
    if (messageTimestamps.length >= 3) {
      for (let i = 1; i < messageTimestamps.length; i++) {
        const prev = messageTimestamps[i - 1];
        const curr = messageTimestamps[i];

        // Messages less than 10 seconds apart might be suspicious
        if (prev && curr && curr.getTime() - prev.getTime() < 10000) {
          riskScore += 10;
        }
      }
    }
  }

  // Check for pattern in the last 3 messages that could be a multi-message attack
  if (userMessages.length >= 2) {
    const recentMessages = userMessages.slice(-3);

    // Check each context pattern
    for (const pattern of contextPatterns) {
      // Look for setup in earlier messages
      const hasSetup = recentMessages
        .slice(0, -1)
        .some((m) => pattern.setup.test(normalizeText(m.content)));

      // Look for attack in the latest message
      const hasAttack = pattern.attack.test(
        normalizeText(recentMessages[recentMessages.length - 1].content),
      );

      if (hasSetup && hasAttack) {
        riskScore += 40; // Significant risk for multi-message attack pattern
      }
    }
  }

  // Check for escalating complexity or length
  if (userMessages.length >= 3) {
    const messageLengths = userMessages.map((m) => m.content.length);
    let increasingPattern = true;

    for (let i = 1; i < messageLengths.length; i++) {
      if (messageLengths[i] <= messageLengths[i - 1]) {
        increasingPattern = false;
        break;
      }
    }

    if (increasingPattern && messageLengths[messageLengths.length - 1] > 500) {
      riskScore += 15; // Risk for gradually increasing message lengths
    }
  }

  return riskScore;
}

// ===== Language Detection =====
function containsNonPersianLanguage(content: string): boolean {
  // Simple heuristic: check if content contains a significant amount of Latin characters
  const persianRegex = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const latinRegex = /[a-zA-Z]/g;

  const persianMatches = content.match(persianRegex) || [];
  const latinMatches = content.match(latinRegex) || [];

  // If more than 20% of characters are Latin and not in acceptable patterns
  // (like technical terms), consider it non-Persian
  if (latinMatches.length > 0) {
    const latinRatio = latinMatches.length / content.length;

    // Exempt short technical terms that might be acceptable
    const shortTechnicalTerms = /\b(PIN|ATM|OTP|SMS|USSD)\b/g;
    const technicalMatches = content.match(shortTechnicalTerms) || [];

    // Adjust ratio by removing acceptable technical terms
    const adjustedLatinCount =
      latinMatches.length - technicalMatches.join('').length;
    const adjustedRatio = adjustedLatinCount / content.length;

    return adjustedRatio > 0.2; // More than 20% non-Persian
  }

  return false;
}

// ===== Token Analysis =====
// Detect attempts to bypass filters by adding spaces or characters between letters
function detectTokenSplitting(content: string): boolean {
  const tokenSplitPatterns = [
    // Characters with spaces or invisible characters between
    /i\s*g\s*n\s*o\s*r\s*e/i,
    /d\s*i\s*s\s*r\s*e\s*g\s*a\s*r\s*d/i,
    /s\s*y\s*s\s*t\s*e\s*m/i,
    /e\s*n\s*g\s*l\s*i\s*s\s*h/i,
    /ا\s*ن\s*گ\s*ل\s*ی\s*س\s*ی/i,
    /ن\s*ا\s*د\s*ی\s*د\s*ه/i,
    /س\s*ی\s*س\s*ت\s*م/i,

    // Leetspeak and character substitution
    /[i1|!][g6][n][o0][r][e3]/i,
    /[e3][n][g6][l1|!][i1|!][s5][h#]/i,
    /[s5][y][s5][t7][e3][m]/i,
  ];

  return tokenSplitPatterns.some((pattern) => pattern.test(content));
}

/**
 * Main security check function
 */
export async function securityCheck(
  messages: ChatMessage[],
): Promise<SecurityCheckResult> {
  try {
    // Validate message format
    const validationResult = messagesSchema.safeParse(messages);
    if (!validationResult.success) {
      return {
        isSecure: false,
        reason: 'Invalid message format',
        riskScore: 100,
      };
    }

    // Get the latest user message
    const latestUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === 'user');

    if (!latestUserMessage) {
      return { isSecure: true, riskScore: 0 };
    }

    const content = latestUserMessage.content;
    const normalizedContent = normalizeText(content);

    // Check for extremely long messages
    if (content.length > 4000) {
      return {
        isSecure: false,
        reason: 'Message exceeds maximum allowed length',
        riskScore: 80,
      };
    }

    // Check for non-Persian language content (critical for this assistant)
    if (containsNonPersianLanguage(content)) {
      return {
        isSecure: false,
        reason: 'Non-Persian language content detected',
        riskScore: 75,
      };
    }

    // Check for token splitting attempts
    if (detectTokenSplitting(content)) {
      return {
        isSecure: false,
        reason: 'Potential filter bypass attempt detected',
        riskScore: 85,
      };
    }

    // Check for all pattern types
    const allPatterns = [
      ...basePatterns,
      ...persianPatterns,
      ...normalizedPatterns,
    ];
    for (const pattern of allPatterns) {
      if (pattern.test(normalizedContent)) {
        return {
          isSecure: false,
          reason: 'Potential prompt injection attempt detected',
          riskScore: 90,
        };
      }
    }

    // Check for sensitive information leakage
    for (const pattern of sensitivePatterns) {
      if (pattern.test(content)) {
        return {
          isSecure: false,
          reason: 'Potential sensitive information in message',
          riskScore: 70,
        };
      }
    }

    // Content classification
    const contentRiskScore = classifyContent(content);

    // History analysis
    const historyRiskScore = analyzeMessageHistory(messages);

    // Calculate final risk score
    const totalRiskScore = contentRiskScore + historyRiskScore;

    // High-risk threshold
    if (totalRiskScore > 50) {
      return {
        isSecure: false,
        reason: 'High-risk content pattern detected',
        riskScore: totalRiskScore,
      };
    }

    // Medium-risk threshold (flag but might allow)
    if (totalRiskScore > 30) {
      return {
        isSecure: true, // Still allow but with caution
        reason: 'Medium-risk content detected',
        riskScore: totalRiskScore,
      };
    }

    return {
      isSecure: true,
      riskScore: totalRiskScore,
    };
  } catch (error) {
    return {
      isSecure: false,
      reason: 'Security check failed',
      riskScore: 100,
    };
  }
}

// ===== Advanced Security Countermeasures =====

/**
 * Rate limiting for repeat offenders
 */
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRecord = rateLimitStore.get(userId);

  if (!userRecord) {
    rateLimitStore.set(userId, { count: 1, timestamp: now });
    return true; // First attempt, no rate limiting
  }

  // Reset count if more than 1 hour has passed
  if (now - userRecord.timestamp > 3600000) {
    rateLimitStore.set(userId, { count: 1, timestamp: now });
    return true;
  }

  // Increment count and check threshold
  userRecord.count += 1;
  rateLimitStore.set(userId, userRecord);

  // If more than 5 potential injection attempts in an hour, rate limit
  return userRecord.count <= 5;
}

/**
 * Sanitize system prompt to protect against leakage
 */
export function sanitizeSystemPrompt(prompt: string): string {
  // Remove sensitive information from the system prompt
  // This is a defense-in-depth measure in case of successful prompt leakage
  return prompt
    .replace(/API keys|encryption keys|password|credentials/gi, '[REDACTED]')
    .replace(/specifics about security/gi, '[SECURITY PROTOCOLS]');
}

/**
 * Enhanced security check with additional context and monitoring
 */
export async function enhancedSecurityCheck(
  messages: ChatMessage[],
  userId: string,
  sessionId: string,
): Promise<SecurityCheckResult> {
  // Check rate limiting first
  if (!checkRateLimit(userId)) {
    // Log the rate limit breach
    console.warn(`Rate limit exceeded for user ${userId}`);
    return {
      isSecure: false,
      reason: 'Rate limit exceeded due to multiple security flags',
      riskScore: 100,
    };
  }

  // Perform the regular security check
  const securityResult = await securityCheck(messages);

  // If not secure, log the potential attack for monitoring
  if (!securityResult.isSecure) {
    // In a production environment, this would call a security logging service
    console.warn(`Potential prompt injection attempt:
      - UserId: ${userId}
      - SessionId: ${sessionId}
      - Reason: ${securityResult.reason}
      - Risk Score: ${securityResult.riskScore}
      - Message Length: ${messages[messages.length - 1]?.content.length}
    `);

    // In a real system, you could add threat intelligence gathering here
    // storeAttackPattern(messages, securityResult);
  }

  return securityResult;
}