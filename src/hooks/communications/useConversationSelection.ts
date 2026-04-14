// src/hooks/communications/useConversationSelection.ts

import { useEffect, useMemo, useState } from "react";

export interface ConversationSelectionItem {
  conversationId: string;
}

export interface UseConversationSelectionOptions<T extends ConversationSelectionItem> {
  conversations: T[];
  autoSelectFirst?: boolean;
  persistKey?: string;
}

export interface UseConversationSelectionResult<T extends ConversationSelectionItem> {
  selectedConversationId: string | null;
  selectedConversation: T | null;
  selectedIndex: number;
  hasSelection: boolean;
  canSelectPrevious: boolean;
  canSelectNext: boolean;
  selectConversationById: (conversationId: string | null) => void;
  selectConversationByIndex: (index: number) => void;
  selectFirstConversation: () => void;
  selectLastConversation: () => void;
  selectPreviousConversation: () => void;
  selectNextConversation: () => void;
  clearSelection: () => void;
}

export default function useConversationSelection<
  T extends ConversationSelectionItem
>(
  options: UseConversationSelectionOptions<T>
): UseConversationSelectionResult<T> {
  const {
    conversations,
    autoSelectFirst = true,
    persistKey,
  } = options;

  const getInitialSelectedId = (): string | null => {
    if (!persistKey || typeof window === "undefined") {
      return null;
    }

    try {
      const storedValue = window.localStorage.getItem(persistKey);
      return storedValue || null;
    } catch {
      return null;
    }
  };

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    getInitialSelectedId
  );

  const selectedIndex = useMemo<number>(() => {
    if (!selectedConversationId) {
      return -1;
    }

    return conversations.findIndex(
      (conversation) => conversation.conversationId === selectedConversationId
    );
  }, [conversations, selectedConversationId]);

  const selectedConversation = useMemo<T | null>(() => {
    if (selectedIndex < 0) {
      return null;
    }

    return conversations[selectedIndex] ?? null;
  }, [conversations, selectedIndex]);

  useEffect(() => {
    if (!conversations.length) {
      if (selectedConversationId !== null) {
        setSelectedConversationId(null);
      }
      return;
    }

    const selectionStillExists = conversations.some(
      (conversation) => conversation.conversationId === selectedConversationId
    );

    if (selectionStillExists) {
      return;
    }

    if (autoSelectFirst) {
      setSelectedConversationId(conversations[0].conversationId);
      return;
    }

    setSelectedConversationId(null);
  }, [conversations, selectedConversationId, autoSelectFirst]);

  useEffect(() => {
    if (!persistKey || typeof window === "undefined") {
      return;
    }

    try {
      if (selectedConversationId) {
        window.localStorage.setItem(persistKey, selectedConversationId);
      } else {
        window.localStorage.removeItem(persistKey);
      }
    } catch {
      // ignore localStorage errors
    }
  }, [persistKey, selectedConversationId]);

  const selectConversationById = (conversationId: string | null) => {
    if (conversationId === null) {
      setSelectedConversationId(null);
      return;
    }

    const exists = conversations.some(
      (conversation) => conversation.conversationId === conversationId
    );

    if (!exists) {
      return;
    }

    setSelectedConversationId(conversationId);
  };

  const selectConversationByIndex = (index: number) => {
    if (index < 0 || index >= conversations.length) {
      return;
    }

    setSelectedConversationId(conversations[index].conversationId);
  };

  const selectFirstConversation = () => {
    if (!conversations.length) {
      return;
    }

    setSelectedConversationId(conversations[0].conversationId);
  };

  const selectLastConversation = () => {
    if (!conversations.length) {
      return;
    }

    setSelectedConversationId(conversations[conversations.length - 1].conversationId);
  };

  const selectPreviousConversation = () => {
    if (selectedIndex <= 0) {
      return;
    }

    setSelectedConversationId(conversations[selectedIndex - 1].conversationId);
  };

  const selectNextConversation = () => {
    if (selectedIndex < 0 || selectedIndex >= conversations.length - 1) {
      return;
    }

    setSelectedConversationId(conversations[selectedIndex + 1].conversationId);
  };

  const clearSelection = () => {
    setSelectedConversationId(null);
  };

  return {
    selectedConversationId,
    selectedConversation,
    selectedIndex,
    hasSelection: selectedConversation !== null,
    canSelectPrevious: selectedIndex > 0,
    canSelectNext: selectedIndex >= 0 && selectedIndex < conversations.length - 1,
    selectConversationById,
    selectConversationByIndex,
    selectFirstConversation,
    selectLastConversation,
    selectPreviousConversation,
    selectNextConversation,
    clearSelection,
  };
}