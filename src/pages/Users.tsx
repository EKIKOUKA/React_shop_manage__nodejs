import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Table, Button, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import request from "../request"
import type { AnyObject } from 'antd/es/_util/type';
import type { SorterResult } from 'antd/es/table/interface';
const { Search } = Input;
import type { GetProps } from 'antd';
type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
    username: string;
    gender: string;
    email: string;
    avatar: string;
    user_id: number;
}

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const columns: ColumnsType<DataType> = [
    {
        title: '名前',
        dataIndex: 'username',
        sorter: true,
        width: '20%'
    },
    {
        title: '性別',
        dataIndex: 'gender',
        filters: [
            { text: 'Male', value: 'male' },
            { text: 'Female', value: 'female' }
        ],
        width: '20%',
        render: (_, record) => {
            return <span> { record.user_id == 1 && record.gender == "male" ? "両百斤真男兒" : record.gender } </span>
        }
    },
    {
        title: "学歴",
        dataIndex: "user_xueli"
    },
    {
        title: 'メール',
        dataIndex: 'user_email'
    },
    {
        title: "写真",
        dataIndex: "avatar",
        render: (_, record) => {
            return <img src={record.avatar} style={{width: "89.64px"}} />
        }
    },
    {
        title: '操作',
        key: 'action',
        width: "10%",
        render: (_, record) => (
            <>
                <Button style={{marginRight: "10px"}} type="primary" shape="circle" icon={<EditOutlined />} />
                <Button style={{marginRight: "10px"}} danger shape="circle" icon={<DeleteOutlined />} />
                <Button style={{marginRight: "10px"}} shape="circle" icon={<SettingOutlined />} />
            </>
        )
    }
];

type SearchProps = GetProps<typeof Input.Search>;
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const Users: React.FC = () => {
    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10
        }
    });

    const fetchData = () => {
        setLoading(true);
        request("getUserList").then(res => {
            console.log("res: ", res)
            setData(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: res.data.length
                }
            });
        });
    };

    useEffect(fetchData, [
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

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <>
            <Search
                placeholder="探す内容を入力"
                allowClear
                enterButton
                size="large"
                style={{ width: 300, marginBottom: "20px", marginRight: "10px" }}
                onSearch={onSearch}
            />
            <Button type="primary" size="large">ユーザーを追加</Button>
            <Table<DataType>
                columns={columns}
                rowKey={(record) => record.user_id}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </>
    )
};

export default Users;