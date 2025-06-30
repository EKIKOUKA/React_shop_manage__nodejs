import React, { useState, useEffect } from "react";
import request from "../utils/request"
import { Table, type TableProps, type GetProp } from 'antd';
import timestampFormat from "../utils/timestampFormat"
import type {SorterResult} from "antd/es/table/interface";
type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const Orders = () => {

    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 50],
            locale: { items_per_page: '件 / ページ' }
        }
    });

    interface DataType {
        order_id: number;
        create_time: string;
        order_type: string;
        order_number: string;
        order_pay: string;
        order_price: string;
        pay_status: string;
        order_content: string;
    }
    const columns: ColumnsType<DataType> = [
        {
            title: '注文ID',
            dataIndex: 'order_id'
        },
        {
            title: '主体',
            dataIndex: 'order_type'
        },
        {
            title: '注文番号',
            dataIndex: 'order_number'
        },
        {
            title: '注文状態',
            dataIndex: 'order_pay',
            render: (_, record) => {
                return <span> { record.order_pay == "1" ? "発送中" : record.order_pay == "2" ? "配達完了" : "出荷" } </span>
            }
        },
        {
            title: '注文支払い状態',
            dataIndex: 'pay_status',
            render: (_, record) => {
                return <span> { record.pay_status == "0" ? "未払い" : "支払い済" } </span>
            }
        },
        {
            title: '商品タイプ',
            dataIndex: 'order_content'
        },
        {
            title: '商品価格',
            dataIndex: 'order_price'
        },
        {
            title: '購入日',
            width: "110px",
            dataIndex: 'create_time',
            render: (_: any, record: any) => (
                <span>{ timestampFormat(record.create_time) }</span>
            )
        }
    ];

    const getOrdersList = () => {
        setLoading(true);
        request("getOrdersList").then(result => {
            setTableData(result.data);
            setLoading(false);
            setTableParams(prevParams => ({
                ...prevParams,
                pagination: {
                    ...prevParams.pagination,
                    total: result.data.length,
                },
            }));
        })
    }
    useEffect(getOrdersList, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        tableParams?.sortOrder,
        tableParams?.sortField,
        JSON.stringify(tableParams.filters),
    ]);

    const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setTableData([]);
        }
    };

    return (
        <div>
            <Table<DataType>
                columns={columns}
                loading={loading}
                rowKey={record => record.order_id}
                dataSource={tableData}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
        </div>
    );
}

export default Orders