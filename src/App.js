import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import "./App.css";

import makeData from "./tableData";

let higherGoals = 0;

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              className={row.cells[2].value === higherGoals ? "goals" : ""}
            >
              {row.cells.map(cell => {
                if (cell.column.Header === "Profile url") {
                  return (
                    <td {...cell.getCellProps()}>
                      <a
                        href={cell.value}
                        target="_blank"
                        rel="noreferrer"
                        className={
                          row.cells[2].value === higherGoals ? "goals" : ""
                        }
                      >
                        Url
                      </a>
                    </td>
                  );
                }
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName",
          },
          {
            Header: "Last Name",
            accessor: "lastName",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Goals",
            accessor: "goals",
          },
          {
            Header: "Visits",
            accessor: "visits",
          },
          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "Profile Progress",
            accessor: "progress",
          },
          {
            Header: "Profile url",
            accessor: "link",
          },
        ],
      },
    ],
    []
  );

  const data = React.useMemo(() => makeData(20), []);

  const [goals, setGoals] = useState(0);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    const getGoals = () => {
      let goals = 0,
        total = 0,
        name;

      data.forEach(item => {
        total += item.goals;
        if (item.goals > goals) {
          name = item.firstName;
          goals = item.goals;
        }
      });
      return { goals, total, name };
    };

    let { goals, total, name } = getGoals();
    setGoals(goals);
    setTotal(total);
    setName(name);
    higherGoals = goals;
  }, [data]);

  return (
    <Styles>
      {!name ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>
            The person who got more goals was: {name} with {goals} goals
          </h1>
          <h2>Total of goals scored: {total}</h2>
        </div>
      )}

      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;
