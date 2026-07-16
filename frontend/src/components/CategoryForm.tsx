import React, { useState } from "react";
import { TextField, Button } from "../vibes";

interface CategoryFormProps {
  onSubmit: (name: string, emoji: string) => Promise<void>;
  onCancel?: () => void;
}

export function CategoryForm({ onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏷️");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name cannot be empty");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), emoji.trim() || "🏷️");
      setName("");
      setEmoji("🏷️");
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Category Name"
        type="text"
        placeholder="Enter category name (e.g. Subscriptions)"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError("");
        }}
        error={error}
        fullWidth
        required
        autoFocus
      />

      <TextField
        label="Category Emoji"
        type="text"
        placeholder="Enter an emoji (default: 🏷️)"
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
        fullWidth
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Adding..." : "Add Category"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
