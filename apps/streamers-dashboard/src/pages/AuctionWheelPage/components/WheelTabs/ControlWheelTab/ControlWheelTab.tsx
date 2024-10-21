import {TabsContent} from '@/components/ui/tabs';
import {Icons} from '@ui/icons';

const ControlWheelTab = () => {
  return (
    <TabsContent
      value="control"
      className="data-[state=active]:h-full flex flex-col gap-y-3 mt-5">
      <div className="flex flex-col gap-y-2">
        <button
          onClick={console.log}
          className="flex gap-x-2 w-fit items-center justify-center bg-green text-white font-semibold text-title px-5 py-3 rounded-[16px]">
          <Icons.Refresh width={21} height={21} />
          Spin wheel
        </button>
      </div>
    </TabsContent>
  );
};

export default ControlWheelTab;
