import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search products...' }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
