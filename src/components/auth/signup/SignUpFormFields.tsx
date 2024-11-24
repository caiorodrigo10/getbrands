import { Input } from "@/components/ui/input";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
            placeholder="First name"
          />
        </div>
        <div>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
            placeholder="Last name"
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
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>
      <div>
        <PhoneInput
          country={'us'}
          value={formData.phone}
          onChange={(phone) => setFormData({ ...formData, phone: phone })}
          inputProps={{
            required: true,
            className: errors.phone ? 'error' : ''
          }}
          containerClass="!w-full"
          inputClass="!w-full !h-[42px] !bg-gray-50 !border-gray-200 !rounded-lg !pl-12 !text-base"
          buttonClass="!border-gray-200 !rounded-l-lg !bg-gray-50"
          dropdownClass="!rounded-lg !border-gray-200"
          buttonStyle={{ backgroundColor: 'rgb(249 250 251)' }}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
        )}
      </div>
    </div>
  );
};