/* The above code is a lexical analyzer for C++ code. */
import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Textarea, Button, background } from "@chakra-ui/react";
import Tablecomp from "./components/Table";
import Tokenizr from "tokenizr";
import Tree from "react-d3-tree";

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
import { Children } from "react";

function App() {
  const code = React.useRef();
  let [showDAta, setShowData] = React.useState([]);
  let [treeDAta, setTreeData] = React.useState({
    name: "start",
    attribute: "code",
    children: [],
    type: "statement",
  });

  const [showres, setShowRes] = React.useState("false");
  const [input, setInput] = React.useState("");
  const [Lexicalerors, seterrors] = React.useState("");
  const keyWords =
    "cin cout auto const double float int short string struct  while unsigned break continue elseforlong signed switch voidcase default enumgoto register sizeof typedef volatile  char do extern if return static unionwhileasm dynamic_cast namespace reinterpret_cast try bool explicit new static_cast typeid catch false operator template typename class friend privatethis using const_cast inline public throw virtual delete mutable protected true wchar_t";
  const keyWords_arr = keyWords.split(" ");
  const Operators_arr = [
    "+",
    "-",
    "<<",
    ">>",
    "++",
    "--",

    "%",
    "++",
    "--",
    "=",
    "+=",
    "-=",
    "*=",
    "%=",
    "==",
    "!=",
    ">",
    "<",
    ">=",
    "<=",
    "&&",
    "||",
  ];

  const seprator_arr = ["(", ")", ",", ";", "{", "}", ":"];
  let identifiers = [];

  /**
   * It checks if the item is a keyword, operator, seprator, integar or identifier
   * @returns the type of the token.
   */
  const checker = (item) => {
    if (keyWords_arr.includes(item)) {
      return "keyword";
    } else if (Operators_arr.includes(item)) {
      return "operator";
    } else if (seprator_arr.includes(item)) return "punctuation";
    else if (Number.isInteger(parseInt(item))) return "integer";
    else if (identifiers.includes(item)) return "identifier";

    return null;
  };
  /**
   * It takes an array of tokens, and if the token before it is a keyword or a comma, it pushes the token
   * into the identifiers array
   */
  const identify = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (checker(arr[i - 1]) == "keyword" || arr[i - 1] == ",") {
        identifiers.push(arr[i]);
      }
    }
  };

  /**
   * It takes an array, and removes all elements between two elements, including the two elements
   */
  const skip2 = (start, stop, inarr) => {
    let count = 1;
    const start_index = inarr.indexOf(start);
    if (start == stop) count++;
    const stop_index = inarr.indexOf(stop, count);

    const dif = stop_index - start_index;

    let newarr = inarr.splice(start_index, dif + 1);
    inarr = newarr;
  };
  //parse tree

  /**
   * It takes an item and an array as arguments, and returns the index of the item in the array
   * @returns The index of the item in the array.
   */
  const findIndex = (item, arr) => {
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name == item) {
        console.log(i);
        index = i;
      }
    }
    return index;
  };
  /**
   * It takes an array of tokens and an index, and returns an object that represents an expression
   * @returns an object with the name, attribute, type, and children of the expression.
   */
  const findExpression = (arr, index) => {
    let x = {};
    for (let i = index; i < arr.length; i++) {
      if (arr[i].attribute == "operator") {
        x = {
          name: arr[i].name,
          attribute: arr[i].attribute,
          type: "expression",
          children: [],
        };
        if (
          ((arr[i - 1].attribute == "identifier" ||
            arr[i - 1].attribute == "integer" ||
            arr[i - 1].attribute == "string" ||
            arr[i - 1].attribute == "char") &&
            arr[i + 1].attribute == "identifier") ||
          arr[i + 1].attribute == "integer" ||
          arr[i + 1].attribute == "string" ||
          arr[i + 1].attribute == "char"
        ) {
          x.children.push({
            name: arr[i - 1].name,
            attribute: arr[i - 1].attribute,
            type: "expression",
          });
          x.children.push({
            name: arr[i + 1].name,
            attribute: arr[i + 1].attribute,
            type: "expression",
          });
        }
      }
    }
    return x;
  };

  /**
   * It takes in an array of objects and an array of strings, and then it creates a tree data structure
   * based on the array of objects
   */
  const drawer = (arr, strings) => {
    let num = 0;
    for (let x of arr) {
      if (x.name == "if" || x.name == "while") {
        setTreeData((prev) => ({
          ...prev,
          children: [
            ...prev.children,
            {
              name: x.name,
              attribute: x.attribute,
              children: [
                {
                  name: arr[findIndex(x.name, arr) + 3].name,
                  attribute: arr[findIndex(x.name, arr) + 3].attribute,
                  type: "expression",
                  children: [
                    {
                      name: arr[findIndex(x.name, arr) + 2].name,
                      attribute: arr[findIndex("if", arr) + 2].attribute,
                      type: "expression",
                    },
                    {
                      name: arr[findIndex(x.name, arr) + 4].name,
                      attribute: arr[findIndex("if", arr) + 4].attribute,
                      type: "expression",
                    },
                  ],
                },
                findExpression(arr, findIndex("{", arr)),
              ],
            },
          ],
        }));
        for (let i = findIndex("}", arr); i < findIndex("}", arr); i++) {
          arr[i] = null;
        }
      } else if (x.name == "cout" || x.name == "cin") {
        setTreeData((prev) => ({
          ...prev,
          children: [
            ...prev.children,
            {
              name: x.name,
              attribute: x.attribute,
              children: [
                {
                  name:
                    x.name == "cout"
                      ? strings[num].item
                      : arr[findIndex(x.name, arr) + 2].name,
                  attribute:
                    x.name == "cout"
                      ? "string"
                      : arr[findIndex(x.name, arr) + 2].attribute,
                  type: "expression",
                },
              ],
            },
          ],
        }));
      } else if (
        x.name == "int" ||
        x.name == "float" ||
        x.name == "char" ||
        x.name == "string" ||
        x.name == "bool"
      ) {
        setTreeData((prev) => ({
          ...prev,
          children: [
            ...prev.children,
            {
              name: x.name,
              attribute: x.attribute,
              children: [
                {
                  name: arr[findIndex(x.name, arr) + 1].name,
                  attribute: arr[findIndex(x.name, arr) + 1].attribute,
                  type: "expression",
                  children: [
                    {
                      name: arr[findIndex(x.name, arr) + 3].name,
                      attribute: arr[findIndex(x.name, arr) + 3].attribute,
                      type: "expression",
                    },
                  ],
                },
              ],
            },
          ],
        }));
      }
    }
  };
  /**
   * It returns a <g> element that contains a circle or a rectangle and a text element
   */
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) =>
    nodeDatum.type == "expression" ? (
      <g>
        <circle r="15" fill="brown" />
        <text fill="brown" strokeWidth="1" x="20">
          {`( ${nodeDatum.name} ) -->${nodeDatum.attribute}`}
        </text>
      </g>
    ) : (
      <g>
        <rect width="20" height="20" x="-10" fill="brown" />
        <text fill="brown" strokeWidth="1" x="20">
          {`( ${nodeDatum.name} ) -->${nodeDatum.attribute}`}
        </text>
      </g>
    );

  const handlingSumbit = (e) => {
    setInput(code.current.value);
    let string = code.current.value.replaceAll("\n", " \n ");
    let reg = /"((?:\\"|[^\r\n])*)"/g;
    let strings = string.matchAll(reg);

    let res = [];
    let index = 0;
    for (let x of strings) {
      res[index] = { item: x[0], index: x.index };
      index++;
    }
    console.log(res);
    string = string.replaceAll("//", " // ");
    string = string.replaceAll("/*", " /* ");
    string = string.replaceAll("*/", " */ ");
    string = string.replaceAll("#", " # ");
    string = string.replaceAll('"', "  ");

    for (const x of seprator_arr) {
      string = string.replaceAll(x, " " + x + " ");
    }
    for (const x of Operators_arr) {
      string = string.replaceAll(x, " " + x + " ");
    }

    let arr = string.split(" ");
    if (arr.includes("//") || arr.includes("/*")) {
      skip2("//", "\n", arr);

      skip2("/*", "*/", arr);
      skip2("#", "\n", arr);
      skip2('"', '"', arr);
    }

    arr = arr.filter((x) => x != "");
    arr = arr.filter((x) => x != "\n");
    arr = arr.filter((x) => x != null);
    arr = arr.filter((x) => x != "str");
    //handle double operators
    /**
     * It takes an array of strings and removes any double operators (e.g. ">>", "<<", "++", "--",
     * "==", "!=", ">=", "<=", "&&", "||", "+=", "-=", "*=", "/=", "%=") and replaces them with a
     * single string (e.g. ">>" becomes ">>")
     */
    const handleDoubleOperators = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        if (
          arr[i] + arr[i + 1] == ">>" ||
          arr[i] + arr[i + 1] == "<<" ||
          arr[i] + arr[i + 1] == "++" ||
          arr[i] + arr[i + 1] == "--" ||
          arr[i] + arr[i + 1] == "==" ||
          arr[i] + arr[i + 1] == "!=" ||
          arr[i] + arr[i + 1] == ">=" ||
          arr[i] + arr[i + 1] == "<=" ||
          arr[i] + arr[i + 1] == "&&" ||
          arr[i] + arr[i + 1] == "||" ||
          arr[i] + arr[i + 1] == "+=" ||
          arr[i] + arr[i + 1] == "-=" ||
          arr[i] + arr[i + 1] == "*=" ||
          arr[i] + arr[i + 1] == "/=" ||
          arr[i] + arr[i + 1] == "%="
        ) {
          arr.splice(i, 2, arr[i] + arr[i + 1]);
        }
      }
    };

    handleDoubleOperators(arr);
    console.log(arr);
    identify(arr);
    let table_Arr = [];
    for (const x of arr) {
      if (checker(x) != null) {
        table_Arr.push({ name: x, attribute: checker(x) });
        arr[arr.indexOf(x)] = null;
      }
    }

    for (const x of res) {
      table_Arr.splice(x.index, 0, { name: x.item, attribute: "string" });
    }
    let errors = [];
    for (let item of arr) {
      if (item != null && !table_Arr.includes(item)) {
        errors.push(item);
        seterrors((prev) => (prev += " " + item));
      }
    }

    setShowData([...table_Arr]);
    let treearr = table_Arr;
    arr = arr.filter((x) => x != null);
    setShowRes((prev) => !prev);

    drawer(treearr, res);
    console.log(treeDAta);
  };

  return showres ? (
    <React.Fragment>
      <div className="head">
        <h1 id="logo">{"{*(صلاح+اشرف)محمد}"}</h1>
      </div>
      <Textarea
        size="xl"
        resize="vertical "
        defaultValue={
          '// this testing code for the small c++ compiler \n int y;\n cin>>y;\ncout<<"hello world"; \n int x=5; if(x<9){\n x=x+1; \n} \n while(x<100){\n x=x+2;\n}  '
        }
        ref={code}
        height="600"
        borderColor="#3F2713"
        border="4px"
        borderRadius="lg"
        padding="1.8em"
        marginTop="20"
      ></Textarea>
      <Button
        size="lg"
        bgColor="#3F2713"
        color="white"
        m="2em"
        onClick={(e) => handlingSumbit(e)}
      >
        Submit
      </Button>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Table
        size="lg"
        variant="striped"
        border="4px"
        bgColor="white"
        colorScheme="black"
        marginTop="4em"
      >
        <TableCaption>Symbol table</TableCaption>
        <Thead>
          <Tr>
            <Th>lexeme</Th>
            <Th>token name</Th>
            <Th>token value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {showDAta.map((x) => (
            <Tr key={showDAta.indexOf(x)}>
              <Td>{x.name}</Td>
              <Td>{x.name}</Td>
              <Td>{x.attribute}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <div
        id="treeWrapper"
        style={{
          position: "absolute",
          left: "0",
          width: "100%",
          height: "600px",
          backgrounColor: "brown",
          border: "10px",
          borderColor: "brown",
          borderRadius: "10",
          marginTop: "50px",
        }}
      >
        <Tree
          data={treeDAta}
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
          orientation="vertical"
          renderCustomNodeElement={renderCustomNodeElement}
          separation={{ siblings: 2, nonSiblings: 2 }}
        />
      </div>
    </React.Fragment>
  );
}

export default App;
