type Props = {
  content: string;
};

export const ChefTalk = ({ content }: Props) => {
  return (
    <div className="bg-orange-50 p-2 rounded-lg shadow w-fit mr-auto text-gray-700 mb-4">
      <p className="whitespace-pre-line">{content}</p>
    </div>
  );
};
