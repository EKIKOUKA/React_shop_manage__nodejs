import React, { useState, useEffect, useRef } from "react";
import request from "../request"
import { Button, Table, Input, Modal, Space, Popconfirm } from 'antd';
import type { TableColumnsType } from 'antd';

const Goods = () => {
    const hasFetched = useRef(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const showModal = (status: 'add' | 'update', record: any) => {
        setIsModalOpen(true);
        setFormStatus(status)
        if (status === "update") {
          setGoods_name(record.goods_name)
          setRecord(record)
        } else {
          setGoods_name("");
          setRecord({});
        }
    };
    const handleOk = () => {
        if (formStatus === "add") {
            handleAdd();
        } else {
            handleUpdate(goodsRecord)
        }
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setGoods_name("");
        setRecord({});
    };

    const [goodsName, setGoods_name] = useState("");
    const [goodsRecord, setRecord] = useState({});
    const [formStatus, setFormStatus] = useState("");
    const [tableData, setTableData] = useState([]);

    interface DataType {
        goods_name: string;
        goods_id: number;
    }
    const columns: TableColumnsType<DataType> = [
        {
          title: '商品名',
          dataIndex: 'goods_name',
          key: 'goods_id'
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <a onClick={() => showModal("update", record)}>編集</a>
                    <Popconfirm title="削除?" cancelText="キャンセル" okText="確定" onConfirm={() => handleDelete(record.goods_id)}>
                        <a>削除</a>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const [tableParams, setTableParams] = useState({
        pagination: {
          current: 1,
          pageSize: 10
        }
    });

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true; // Set to true immediately
            getGoodsList();
        }
    }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

    const getGoodsList = () => {
        setLoading(true);
        request("getGoodsList").then(result => {
            console.log("request data: ", result.data);
            setTableData(result.data);
            setLoading(false);
            setTableParams(prevParams => ({ // Use functional update for setTableParams
                ...prevParams,
                pagination: {
                    ...prevParams.pagination,
                    total: result.data.length,
                },
            }));
        })
    }
    useEffect(() => {
        if (hasFetched.current) {
            getGoodsList();
        }
    }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

    const handleTableChange = (
        pagination: any,
        filters: Record<string, any>,
        sorter: any
    ) => {
        setTableParams(prevParams => { // Use functional update
            const newParams = {
                pagination,
                filters,
                sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
                sortField: Array.isArray(sorter) ? undefined : sorter.field,
            };
            return newParams;
        });
    };
    const handleAdd = () => {
        const newData = {
            goods_name: goodsName
        };

        request("addGood", {
            goods_name: newData.goods_name
        }).then(result => {
            console.log("request result: ", result);
            getGoodsList()
            setGoods_name("")
            setIsModalOpen(false)
        });
    };
    const handleDelete = (key: number) => {
        request("deleteGood", {
            id: key
        }).then(result => {
            console.log("request result: ", result);
            getGoodsList()
        })
    };
    const handleUpdate = (params: any) => {
        console.log("params:", params);
        request("updateGood", {
            goods_id: params.goods_id,
            goods_name: goodsName
        }).then(result => {
            console.log("request result: ", result);
            getGoodsList()
            setGoods_name("");
            setRecord({});
            setIsModalOpen(false);
        })
    }

    return (
        <div>
            <Button onClick={() => showModal("add", null)} type="primary" style={{ marginBottom: 16 }}>
                追加
            </Button>
            <Modal
              title="商品名"
              closable={false}
              open={isModalOpen}
              cancelText="キャンセル" 
              okText="確定"
              onOk={handleOk}
              onCancel={handleCancel}
            >
                <Input placeholder="商品名" value={goodsName} onChange={e => setGoods_name(e.target.value)} />
            </Modal>
            <Table
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