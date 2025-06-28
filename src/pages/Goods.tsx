import React, { useState, useEffect, useRef } from "react";
import request from "../request"
import {Button, Table, Input, Modal, Space, Popconfirm, Form, InputNumber} from 'antd';
import type { GetProp, TableProps, FormProps } from 'antd';
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import timestampFormat from "../utils/timestampFormat";
const { TextArea } = Input;
import type {SorterResult} from "antd/es/table/interface";
type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}
interface goodsDataType {
    goods_name: string;
    goods_price: number;
    goods_number: number;
    goods_id: number;
}

const Goods = () => {
    const [goodsForm] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalTitle, setModalTitle] = useState('追加');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const showModal = (status: 'add' | 'update', record?: goodsDataType) => {
        console.log("record: ", record)
        setModalTitle(status == "add" ? "追加" : "更新")
        if (status === "update") {
            goodsForm.setFieldsValue(record);
        } else {
            goodsForm.resetFields();
        }
        setIsModalOpen(true);
    };

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
        goods_name: string;
        goods_id: number;
    }
    const columns: ColumnsType<DataType> = [
        {
          title: '商品名',
          dataIndex: 'goods_name',
          key: 'goods_id'
        }, {
          title: '商品価格',
          dataIndex: 'goods_price',
          width: "88px"
        }, {
          title: '商品数量',
          dataIndex: 'goods_number',
          width: "88px"
        }, {
            title: '作成日',
            width: "110px",
            dataIndex: 'add_time',
            render: (_: any, record: any) => (
                <span>{ timestampFormat(record.add_time) }</span>
            )
        }, {
            title: '操作',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button onClick={() => showModal("update", record)} type="primary" icon={<EditOutlined />}>編集</Button>
                    <Popconfirm title="削除?" cancelText="キャンセル" okText="確定" onConfirm={() => handleDelete(record.goods_id)}>
                        <Button danger icon={<DeleteOutlined />}>削除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const getGoodsList = () => {
        setLoading(true);
        request("getGoodsList").then(result => {
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
    useEffect(getGoodsList, [
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
    const handleCancel = () => {
        setIsModalOpen(false);
        goodsForm.resetFields();
    };

    const onFinishForm: FormProps<goodsDataType>['onFinish'] = (values) => {
        setConfirmLoading(true);
        request(modalTitle === "追加" ? "addGood" : "updateGood", values).then(result => {
            handleCancel();
            setConfirmLoading(false);
            getGoodsList()
        })
    };
    const onFinishFormFailed: FormProps<goodsDataType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const handleDelete = (key: number) => {
        request("deleteGood", {
            id: key
        }).then(() => {
            getGoodsList()
        })
    };

    return (
        <div>
            <Button onClick={() => showModal("add")} type="primary" style={{ marginBottom: 16 }}>商品を追加</Button>
            <Modal
              title={modalTitle}
              footer={null}
              open={isModalOpen}
              onCancel={handleCancel}
            >
                <Form
                    name="basic"
                    form={goodsForm}
                    labelCol={{ span: 4 }}
                    onFinish={onFinishForm}
                    onFinishFailed={onFinishFormFailed}
                    autoComplete="off"
                    style={{ marginTop: 30 }}
                >
                    <Form.Item<goodsDataType> label="商品名" name="goods_name"
                        rules={[{ required: true, message: '商品名を入力してください' }]}
                    >
                        <TextArea autoSize allowClear placeholder="商品名" />
                    </Form.Item>
                    <Form.Item<goodsDataType> label="価格" name="goods_price"
                        rules={[{ required: true, message: '価格を入力してください' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="価格" />
                    </Form.Item>
                    <Form.Item<goodsDataType> label="数量" name="goods_number"
                        rules={[{ required: true, message: '数量を入力してください' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="数量" />
                    </Form.Item>
                    <Form.Item<goodsDataType> name="goods_id" style={{ display: 'none' }}>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item label={null}>
                        <Button loading={confirmLoading} type="primary" htmlType="submit" style={{ marginLeft: "89.64px" }}>{modalTitle}</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Table<DataType>
                columns={columns}
                loading={loading}
                rowKey={record => record.goods_id}
                dataSource={tableData}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default Goods;