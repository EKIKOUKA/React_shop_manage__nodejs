import React, { useState, useEffect, useRef } from "react";
import request from "./request"
import { Button, Table, Input, Modal, Space, Popconfirm } from 'antd';

function TableList() {
  const hasFetched = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const showModal = (status, record) => {
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
    const columns = [
        {
          title: '商品名',
          dataIndex: 'goods_name',
          key: 'goods_name',
          editable: true,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm title="削除?" onConfirm={() => handleDelete(record.goods_id)}>
                        <a>削除</a>
                    </Popconfirm>
                    <a onClick={() => showModal("update", record)}>編集</a>
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

    useEffect(() => {
      if (!hasFetched.current) {
        hasFetched.current = true; // Set to true immediately
        getGoodsList();
      }
    }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

    const getGoodsList = () => {
      setLoading(true);
      request("getGoodsList").then(data => {
        console.log("request data: ", data);
        setTableData(data);
        setLoading(false);
        setTableParams(prevParams => ({ // Use functional update for setTableParams
            ...prevParams,
            pagination: {
                ...prevParams.pagination,
                total: data.length,
            },
        }));
      })
    }
    useEffect(() => {
      if (hasFetched.current) {
         getGoodsList();
      }
    }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

    const handleTableChange = (pagination, filters, sorter) => {
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
        }).then(data => {
            console.log("request data: ", data);
            getGoodsList()
            setGoods_name("")
            setIsModalOpen(false)
        });
    };
    const handleDelete = (key) => {
        request("deleteGood", {
            id: key
        }).then(data => {
          console.log("request data: ", data);
          getGoodsList()
      })
    };
    const handleUpdate = data => {
      console.log("data:", data);
      request("updateGood", {
        goods_id: data.goods_id,
        goods_name: goodsName
      }).then(data_ => {
          console.log("request data: ", data_);
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
}

export default TableList;