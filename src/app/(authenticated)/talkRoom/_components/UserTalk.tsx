type UserTalkProps = {
  content: string;
};

export const UserTalk = ({ content }: UserTalkProps) => {
  return (
    <div className="bg-blue-50 p-2 rounded-lg shadow w-fit ml-auto text-gray-700 mb-4">
      <p>{content}</p>
    </div>
  );
};
