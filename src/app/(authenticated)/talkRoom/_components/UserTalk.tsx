type Props = {
  content: string;
};

export const UserTalk = ({ content }: Props) => {
  return (
    <div className="bg-blue-50 p-2 rounded-lg shadow w-fit ml-auto text-gray-700 mb-4">
      <p>{content}</p>
    </div>
  );
};
