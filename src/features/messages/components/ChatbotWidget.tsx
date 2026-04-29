"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { useTranslations } from "next-intl";
import {
  ChatbotQuestionKey,
  getChatbotAnswerTranslationKey,
  getChatbotQuestionTranslationKey,
} from "@/features/messages/constants/chatbot";

interface ChatbotWidgetProps {
  questionKey: ChatbotQuestionKey;
  onClose?: () => void;
}

export function ChatbotWidget({ questionKey, onClose }: ChatbotWidgetProps) {
  const t = useTranslations("chatbot");
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const question = t(getChatbotQuestionTranslationKey(questionKey));
  const answer =
    t(getChatbotAnswerTranslationKey(questionKey)) || t("answers.fallback");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-sm bg-card border border-border rounded-2xl p-6">
        <DialogTitle className="sr-only">{t("widget.dialogTitle")}</DialogTitle>
        <div className="space-y-4">
          {/* Question */}
          <div className="bg-secondary rounded-lg p-3">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {t("widget.questionLabel")}
            </h3>
            <p className="text-sm text-foreground">{question}</p>
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              {t("widget.answerLabel")}
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {answer}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors text-sm"
          >
            {t("widget.close")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
