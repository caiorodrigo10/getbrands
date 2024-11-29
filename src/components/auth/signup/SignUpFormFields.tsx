import { Input } from "@/components/ui/input";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTranslation } from "react-i18next";

interface SignUpFormFieldsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
  };
  errors: {
    password: string;
    phone?: string;
  };
  setFormData: (data: any) => void;
}

export const SignUpFormFields = ({ formData, errors, setFormData }: SignUpFormFieldsProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
            placeholder={t('auth.firstName')}
          />
        </div>
        <div>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
            placeholder={t('auth.lastName')}
          />
        </div>
      </div>
      <div>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
          placeholder={t('auth.emailPlaceholder')}
        />
      </div>
      <div>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
          placeholder={t('auth.passwordPlaceholder')}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>
      <div className="phone-input-container [&_.react-tel-input]:w-full [&_.react-tel-input_.form-control]:!w-full [&_.react-tel-input_.form-control]:!h-[42px] [&_.react-tel-input_.flag-dropdown]:!h-[42px] [&_.react-tel-input_.selected-flag]:!h-[40px] [&_.react-tel-input_.flag-dropdown]:!border-gray-200 [&_.react-tel-input_.form-control]:!bg-white [&_.react-tel-input_.form-control]:!border-gray-200 [&_.react-tel-input_.form-control]:!text-base [&_.react-tel-input_.selected-flag]:before:!content-['|'] [&_.react-tel-input_.selected-flag]:before:!absolute [&_.react-tel-input_.selected-flag]:before:!right-0 [&_.react-tel-input_.selected-flag]:before:!h-full [&_.react-tel-input_.selected-flag]:before:!flex [&_.react-tel-input_.selected-flag]:before:!items-center [&_.react-tel-input_.selected-flag]:before:!text-gray-300 [&_.react-tel-input_.form-control]:!pl-[62px] [&_.react-tel-input_.form-control]:!rounded-lg">
        <PhoneInput
          country={'us'}
          value={formData.phone}
          onChange={(phone) => setFormData({ ...formData, phone: phone })}
          inputProps={{
            required: true,
          }}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
        )}
      </div>
    </div>
  );
};