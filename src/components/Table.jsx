import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
const Tablecomp = ({ table_arr }) => {
  let showData = table_arr;
  showData.map((x) => (
    <Tr>
      <Td>{x.name}</Td>
      <Td>{`<${x.name},${x.attribute}>`}</Td>
    </Tr>
  ));
  return (
    <Table size="lg">
      <TableCaption>Symbol table</TableCaption>
      <Tr>
        <Th>lexeme</Th>
        <Th>token</Th>
      </Tr>
      {showData}
    </Table>
  );
};

export default Table;
