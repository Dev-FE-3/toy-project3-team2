import { TextArea } from "@/components/common/TextArea";

interface DescriptionFieldProps {
  description: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const DescriptionField = ({ description, onChange }: DescriptionFieldProps) => {
  return (
    <li>
      <TextArea
        htmlFor="user-description"
        placeholder="소개글을 입력하세요"
        label="소개"
        maxLength={300}
        value={description}
        onChange={onChange}
      />
    </li>
  );
};

export default DescriptionField;
