import type { InputHTMLAttributes } from 'react'
import { Label } from '../../atoms/Label'
import { Input } from '../../atoms/Input'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  fieldId: string
  error?: string
}

export function FormField({ label, fieldId, id: _id, error, ...inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input id={fieldId} hasError={!!error} {...inputProps} />
      {error && (
        <span role="alert" className="text-xs text-error">
          {error}
        </span>
      )}
    </div>
  )
}
