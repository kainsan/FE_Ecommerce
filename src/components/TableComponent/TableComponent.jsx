import React, { useState } from "react";
import { Divider, Radio, Table } from "antd";
import type { TableColumnsType } from "antd";
import Pending from '../PendingComponent/Pending';
import { Excel } from "antd-table-saveas-excel";
import { useMemo } from 'react';

const TableComponent = (props) => {
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const {
    selectionType = "checkbox",
    data: dataSource  = [],
    isPending = false,
    columns = [],
    handleDeleteMany 
  } = props;


  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== 'action')
    return arr
  }, [columns])

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
    }, 
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys)
  }

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true
      })
      .saveAs("Excel.xlsx");
  };

  return (
    <Pending isPending={isPending}>
      {!!rowSelectedKeys?.length > 0 && (
        <div style={{
          background: 'red',
          color: '#fff',
          fontWeight: 'bold',
          padding: '10px',
          cursor: 'pointer',
          width:'100px'
        }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
       )}
       <button type="button" className="w-[150px] h-8 px-4 bg-green-600 text-[#fff] text-center border" onClick={exportExcel}>Export Excel</button>
      <Table
        id="table-xls"
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </Pending>
  );
};

export default TableComponent;
