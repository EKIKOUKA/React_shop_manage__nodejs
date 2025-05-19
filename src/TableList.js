import React, { useState } from "react";
import request from "./request"
import { Button, Table, Input, Space, Popconfirm } from 'antd';

function TableList() {
    const [tableData, setTableData] = useState([]);
    const columns = [
        {
          title: 'Name',
          dataIndex: 'goods_name',
          key: 'goods_name',
        },
        {
          title: 'goods_price',
          dataIndex: 'goods_price',
          key: 'goods_price',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <button>Invite {record.name}</button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.goods_id)}>
                        <a>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        }
    ];
    const [tableParams, setTableParams] = useState({
        pagination: {
          current: 1,
          pageSize: 10,
        },
    });

    React.useEffect(() => {
        request("api/getGoodsList").then(data => {
            console.log("request data: ", data);
            setTableData(data);
            setTableParams(
                Object.assign(Object.assign({}, tableParams), {
                    pagination: Object.assign(Object.assign({}, tableParams.pagination), { total: data.length }),
                }),
            );
        })
    }, []);
    const handleTableChange = (pagination, filters, sorter) => {
        var _a;
        setTableParams({
          pagination,
          filters,
          sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
          sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });
        // `dataSource` is useless since `pageSize` changed
        if (
          pagination.pageSize !==
          ((_a = tableParams.pagination) === null || _a === void 0 ? void 0 : _a.pageSize)
        ) {
          setTableData([]);
        }
    };
    const handleDelete = (key) => {
        request("api/deleteGood", {
            id: key
        }).then(data => {
          console.log("request data: ", data);
          const newData = tableData.filter((item) => item.goods_id !== key);
          setTableData(newData);
          setTableParams(
            Object.assign(Object.assign({}, tableParams), {
                pagination: Object.assign(Object.assign({}, tableParams.pagination), { total: data.length }),
            }),
        );
      })
    };

    return (
        <div>
            <Table
                columns={columns}
                rowKey={record => record.goods_id}
                dataSource={tableData}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
        </div>
    );
}

export default TableList;