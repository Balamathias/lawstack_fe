'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface Institution {
  id: string;
  name: string;
}

interface CourseFilterBarClientProps {
  initialSearch: string;
  initialInstitution: string;
  institutions: Institution[];
}

export default function CourseFilterBarClient({ 
  initialSearch, 
  initialInstitution,
  institutions 
}: CourseFilterBarClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [institutionFilter, setInstitutionFilter] = useState(initialInstitution);
  
  // Apply filters by updating the URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (institutionFilter) params.append('institution', institutionFilter);
    
    router.push(`/dashboard/courses?${params.toString()}`);
  };
  
  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };
  
  // Handle institution selection change
  const handleInstitutionChange = (value: string) => {
    setInstitutionFilter(value);
    // Auto-apply filter when institution changes
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (value) params.append('institution', value);
    router.push(`/dashboard/courses?${params.toString()}`);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
      
      <div className="w-full sm:w-[200px]">
        <Select 
          value={institutionFilter} 
          onValueChange={handleInstitutionChange}
        >
          <SelectTrigger>
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Institutions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Institutions</SelectItem>
            {institutions.map(inst => (
              <SelectItem key={inst.id} value={inst.id}>
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 