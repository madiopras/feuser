import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SearchRoute = () => {
  return (
    <Accordion type="single" collapsible className="w-full  space-y-3.5">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex flex-col  text-start">
            <div>Medan - Pekanbaru</div>
            <div className=" text-xs  text-default-600  mt-1">
              Sabtu, 11 Januari 2025 | 2 Kursi
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
         form
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SearchRoute;
