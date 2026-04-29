"use client";

interface ChatSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
}

export function ChatSuggestions({
  suggestions,
  onSuggestionClick,
  disabled = false,
}: ChatSuggestionsProps) {
  return (
    <div className="px-3 pb-2 flex flex-col gap-1.5">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSuggestionClick(suggestion)}
          disabled={disabled}
          className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/6 text-white/70 text-xs transition-colors disabled:opacity-50"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
