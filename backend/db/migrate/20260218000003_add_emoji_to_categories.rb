class AddEmojiToCategories < ActiveRecord::Migration[7.2]
  def up
    add_column :categories, :emoji, :string, limit: 10, default: "🏷️"

    # Backfill default categories
    emoji_mappings = {
      "Food" => "🍔",
      "Transportation" => "🚗",
      "Entertainment" => "🎬",
      "Shopping" => "🛍️",
      "Bills" => "📄",
      "Healthcare" => "🏥",
      "Education" => "📚",
      "Travel" => "✈️",
      "Personal" => "🏷️",
      "Other" => "📦"
    }

    Category.reset_column_information
    Category.find_each do |category|
      if emoji_mappings.key?(category.name)
        category.update!(emoji: emoji_mappings[category.name])
      end
    end
  end

  def down
    remove_column :categories, :emoji
  end
end
