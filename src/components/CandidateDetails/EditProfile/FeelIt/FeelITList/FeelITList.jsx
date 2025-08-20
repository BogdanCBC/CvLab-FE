import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import FeelITItem from "../FeelITItem/FeelITItem";
import "./FeelITList.css";

export default function FeelITList({
  clients,
  updateFeelItClient,
  removeFeelItClient,
  addFeelItResponsibility,
  updateFeelItResponsibility,
  removeFeelItResponsibility,
}) {
  return (
    <div>
      <SortableContext
        items={clients.map((_, index) => index.toString())}
        strategy={verticalListSortingStrategy}
      >
        {clients.map((client, index) => (
          <FeelITItem
            key={index}
            client={client}
            index={index}
            updateFeelItClient={updateFeelItClient}
            removeFeelItClient={removeFeelItClient}
            addFeelItResponsibility={addFeelItResponsibility}
            updateFeelItResponsibility={updateFeelItResponsibility}
            removeFeelItResponsibility={removeFeelItResponsibility}
          />
        ))}
      </SortableContext>
    </div>
  );
}
