import {
  Mapaccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/mapaccordion.tsx";
import { trpc } from "@/utils/trpc.ts";
import MapForNodeEditing from "@/components/MapForNodeEditing.tsx";

export default function FloorTabs() {
  const nodesQuery = trpc.node.getAll.useQuery();
  const edgeQuery = trpc.db.getAllEdges.useQuery();

  return (
    <Mapaccordion
      type="single"
      collapsible
      className="w-full flex flex-col h-full"
      defaultValue="firstfloor"
    >
      <AccordionItem
        value="thirdfloor"
        className="[&[data-state=open]]:h-full flex flex-col"
      >
        <AccordionTrigger>Third Floor</AccordionTrigger>
        <AccordionContent className="relative h-full">
          <div className="absolute top-0 bottom-0 w-full flex justify-center">
            <MapForNodeEditing
              nodes={nodesQuery.data} // Pass node data as a prop
              imgURL="/03_thethirdfloor.png"
              floor="3"
              className="object-cover h-full"
              edges={edgeQuery.data}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="secondfloor"
        className="[&[data-state=open]]:h-full flex flex-col"
      >
        <AccordionTrigger>Second Floor</AccordionTrigger>
        <AccordionContent className="relative h-full">
          <div className="absolute top-0 bottom-0 w-full flex justify-center">
            <MapForNodeEditing
              nodes={nodesQuery.data} // Pass node data as a prop
              imgURL="/02_thesecondfloor.png"
              floor="2"
              className="object-cover h-full"
              edges={edgeQuery.data}
            />
            {/*<img*/}
            {/*  src="/02_thesecondfloor.png"*/}
            {/*  alt="Lower level 1 image"*/}
            {/*  className="object-cover h-full"*/}
            {/*/>*/}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="firstfloor"
        className="[&[data-state=open]]:h-full flex flex-col"
      >
        <AccordionTrigger>First Floor</AccordionTrigger>
        <AccordionContent className="relative h-full">
          <div className="absolute top-0 bottom-0 w-full flex justify-center">
            <MapForNodeEditing
              nodes={nodesQuery.data} // Pass node data as a prop
              imgURL="/01_thefirstfloor.png"
              floor="1"
              className="object-cover h-full"
              edges={edgeQuery.data}
            />
            {/*<img*/}
            {/*  src="/01_thefirstfloor.png"*/}
            {/*  alt="Lower level 1 image"*/}
            {/*  className="object-cover h-full"*/}
            {/*/>*/}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="lowerlevelone"
        className="[&[data-state=open]]:h-full flex flex-col"
      >
        <AccordionTrigger>Lower Level One</AccordionTrigger>
        <AccordionContent className="relative h-full">
          <div className="absolute top-0 bottom-0 w-full flex justify-center">
            <MapForNodeEditing
              nodes={nodesQuery.data} // Pass node data as a prop
              imgURL="/00_thelowerlevel1.png"
              floor="L1"
              className="object-cover h-full"
              edges={edgeQuery.data}
            />
            {/*<img*/}
            {/*  src="/00_thelowerlevel1.png"*/}
            {/*  alt="Lower level 1 Image"*/}
            {/*  className="object-cover h-full"*/}
            {/*/>*/}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="lowerleveltwo"
        className="[&[data-state=open]]:h-full flex flex-col"
      >
        <AccordionTrigger>Lower Level Two</AccordionTrigger>
        <AccordionContent className="relative h-full">
          <div className="absolute top-0 bottom-0 w-full flex justify-center">
            <MapForNodeEditing
              nodes={nodesQuery.data} // Pass node data as a prop
              imgURL="/00_thelowerlevel2.png"
              floor="L2"
              className="object-cover h-full"
              edges={edgeQuery.data}
            />
            {/*<img*/}
            {/*  src="/00_thelowerlevel2.png"*/}
            {/*  alt="Lower level 1 Image"*/}
            {/*  className="object-cover h-full"*/}
            {/*/>*/}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Mapaccordion>
  );
}
