import React, { useState } from 'react'
import { Institution } from '@/services/server/institutions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye, MoreHorizontal, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import DeleteInstitutionDialog from './delete-institution-dialog'

interface InstitutionRowProps {
  institution: Institution
  onDelete: (id: string) => void
  isDeleting: boolean
}

const InstitutionRow = ({ institution, onDelete, isDeleting }: InstitutionRowProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getInstitutionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'university':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'college':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'polytechnic':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'high school':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <>
      <tr className="hover:bg-muted/20">
        <td className="py-3 px-4">
          <div>
            <p className="font-medium">{institution.name}</p>
            <p className="text-xs text-muted-foreground">
              {institution.short_name}
            </p>
            {institution.website && (
              <a 
                href={institution.website}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
              >
                <LinkIcon className="h-3 w-3" />
                Website
              </a>
            )}
          </div>
        </td>
        <td className="py-3 px-4 hidden md:table-cell">
          <Badge variant="outline" className={getInstitutionTypeColor(institution.type)}>
            {institution.type}
          </Badge>
        </td>
        <td className="py-3 px-4 hidden lg:table-cell">
          <div className="text-sm">
            <p>{institution.city}, {institution.state}</p>
            <p className="text-xs text-muted-foreground">{institution.country}</p>
          </div>
        </td>
        <td className="py-3 px-4 text-right">
          {/* Desktop Actions */}
          <div className="hidden sm:flex gap-2 items-center justify-end">
            <Link href={`/admin/institutions/${institution.id}/view`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/admin/institutions/${institution.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/institutions/${institution.id}/view`} className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/institutions/${institution.id}/edit`} className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>

      <DeleteInstitutionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onDelete={() => {
          onDelete(institution.id)
          setShowDeleteDialog(false)
        }}
        institutionName={institution.name}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default InstitutionRow
