import { useEffect, useRef, useState, type RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>(
  status?: 'idle' | 'streaming' | 'submitted' | 'ready' | 'error',
): [RefObject<T>, RefObject<T>, boolean, () => void] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const prevStatusRef = useRef(status);
  const lastScrollTopRef = useRef(0);
  const scrollThresholdRef = useRef(0);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (endRef.current) {
      setShouldAutoScroll(true);
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });

      // Hide the button after scrolling to bottom
      setTimeout(() => {
        if (containerRef.current) {
          const container = containerRef.current;
          const distanceFromBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;

          if (distanceFromBottom < 100) {
            setShowScrollButton(false);
            scrollThresholdRef.current = 0;
          }
        }
      }, 500); // Give enough time for the scroll animation to complete
    }
  };

  // Add extra scroll to show feedback elements
  const scrollWithExtraOffset = (offset = 50) => {
    if (containerRef.current) {
      const container = containerRef.current;
      // First scroll to bottom
      endRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
      // Then add the extra offset
      setTimeout(() => {
        container.scrollTop += offset;
      }, 100);
    }
  };

  // Track scroll position to show/hide scroll button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Check if user is scrolling manually
      setIsUserScrolling(true);

      // Calculate distance from bottom
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      // Determine scroll direction
      const currentScrollTop = container.scrollTop;
      const isScrollingTowardTop = currentScrollTop < lastScrollTopRef.current;
      const isScrollingTowardBottom =
        currentScrollTop > lastScrollTopRef.current;

      // Update scroll threshold based on direction
      if (isScrollingTowardBottom) {
        // When scrolling toward bottom (toward latest messages)
        scrollThresholdRef.current +=
          currentScrollTop - lastScrollTopRef.current;

        // Show button when scrolled toward bottom more than 50px and not at bottom
        if (scrollThresholdRef.current > 50 && distanceFromBottom > 100) {
          setShowScrollButton(true);
        }
      } else if (isScrollingTowardTop) {
        // When scrolling toward top (away from latest messages)
        scrollThresholdRef.current = 0;
        setShowScrollButton(false);
      }

      // Hide button when we're near bottom of chat
      if (distanceFromBottom < 100) {
        setShowScrollButton(false);
        scrollThresholdRef.current = 0;
      }

      // Determine if we're near the bottom for auto-scroll behavior
      setShouldAutoScroll(distanceFromBottom < 100);

      // Store current scroll position
      lastScrollTopRef.current = currentScrollTop;

      // Reset user scrolling flag after a short delay
      setTimeout(() => setIsUserScrolling(false), 100);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        // Only auto-scroll if streaming AND user is already near the bottom
        if (status === 'streaming' && shouldAutoScroll && !isUserScrolling) {
          end.scrollIntoView({ behavior: 'instant', block: 'end' });
          return;
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, [status, shouldAutoScroll, isUserScrolling]);

  // Ensure scrolling to bottom when streaming initially starts or a message is sent
  useEffect(() => {
    // Detect when streaming has just ended
    const wasStreaming = prevStatusRef.current === 'streaming';
    const isNowFinished = status !== 'streaming' && status !== 'submitted';

    // Add the extra scroll when streaming finishes
    if (wasStreaming && isNowFinished && shouldAutoScroll) {
      scrollWithExtraOffset(50);
    }
    // Handle message submission and stream start
    else if (
      status !== prevStatusRef.current &&
      (status === 'streaming' || status === 'submitted') &&
      endRef.current
    ) {
      // Always scroll to bottom when user sends a message
      endRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
      setShouldAutoScroll(true);
    }

    prevStatusRef.current = status;
  }, [status, shouldAutoScroll]);

  return [containerRef, endRef, showScrollButton, scrollToBottom];
}
