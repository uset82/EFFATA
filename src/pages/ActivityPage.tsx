import ActivityChart from "@/components/ActivityChart";

const ActivityPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <ActivityChart className="dark" />
      </div>
    </div>
  );
};

export default ActivityPage;