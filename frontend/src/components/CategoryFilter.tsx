import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function CategoryFilter({ onCategoryChange, categories }: CategoryFilterProps) {
  return (
    <Select onValueChange={onCategoryChange}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
