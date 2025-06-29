import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, Switch, Popconfirm, Select, Upload, Image } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import request from "../utils/request"
import type { SorterResult } from 'antd/es/table/interface';
import type { GetProp, TableProps, FormProps, UploadFile, UploadProps } from 'antd';
type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import ImgCrop from 'antd-img-crop';

interface userDataType {
    isActive: true | false;
    username: string;
    gender: string;
    user_email: string;
    avatar: string;
    user_id: number;
    user_edu: number;
}

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

interface Education {
    edu_id: number,
    label: string
}

const Users: React.FC = () => {

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalTitle, setModalTitle] = useState('追加');
    const [educationList, setEducationList] = useState<Education[]>([])
    const [userForm] = Form.useForm();
    const [searchForm] = Form.useForm();
    const [data, setData] = useState<userDataType[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 50],
            locale: { items_per_page: '件 / ページ' }
        }
    });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const columns: ColumnsType<userDataType> = [
        {
            title: 'ID',
            dataIndex: 'user_id',
            sorter: (a, b) => a.user_id - b.user_id
        },
        {
            title: '名前',
            dataIndex: 'username'
        },
        {
            title: '性別',
            dataIndex: 'gender',
            filters: [
                { text: 'Male', value: 'male' },
                { text: 'Female', value: 'female' }
            ],
            onFilter: (value, record) => record.gender === value,
            render: (_, record) => {
                return <span> { record.user_id == 1 && record.gender == "male" ? "両百斤真男兒" : record.gender == "female" ? "女性" : "男性" } </span>
            }
        },
        {
            title: "学歴",
            dataIndex: "user_edu",
            render: (_, record) => {
                const edu = educationList.find(e => e.edu_id === record.user_edu)
                return edu?.label
            }
        },
        {
            title: 'メール',
            dataIndex: 'user_email'
        },
        {
            title: '状態',
            dataIndex: 'isActive',
            render: (_, record) => {
                return (
                    <Popconfirm title="変更?" cancelText="キャンセル" okText="確定" onConfirm={() => handleActiveConfirm(record) }>
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            checked={record.isActive}
                        />
                    </Popconfirm>
                )
            }
        },
        {
            title: "アバター",
            dataIndex: "avatar",
            render: (_, record) => {
                return record.avatar
                    ? <img src={record.avatar} style={{ width: "60px" }} />
                    : null
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 216,
            render: (_, record) => (
                <>
                    <Button onClick={() => showModal("update", record)} style={{marginRight: "10px"}} type="primary" icon={<EditOutlined />}>編集</Button>
                    <Popconfirm title="削除?" cancelText="キャンセル" okText="確定" onConfirm={() => deleteUser(record.user_id)}>
                        <Button style={{marginRight: "10px"}} danger icon={<DeleteOutlined />}>削除</Button>
                    </Popconfirm>
                </>
            )
        }
    ];


    const showModal = (status: 'add' | 'update', record?: userDataType) => {
        setModalTitle(status == "add" ? "追加" : "更新")
        if (status === "update" && record) {
            const avatarList: UploadFile[] = record.avatar
                ? [{
                    uid: '-1',
                    name: 'avatar.jpg',
                    status: 'done',
                    url: record.avatar
                }]
                : [];
            setFileList(avatarList);
            userForm.setFieldsValue(record);
        } else {
            userForm.resetFields();
        }
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
        userForm.resetFields();
        setFileList([])
    };
    const handleActiveConfirm = (record: userDataType) => {
        request("updateUserActive", {
            user_id: record.user_id,
            isActive: (record as any).isActive = record.isActive ? 0 : 1
        }).then(() => {
            onFinishSearch(searchForm.getFieldsValue())
        })
    }


    const onFinishForm: FormProps<userDataType>['onFinish'] = (values) => {
        values.avatar = modalTitle === "追加" ? fileList[0]?.response.url : fileList[0]?.url;
        (values as any).isActive = values.isActive ? 1 : 0;
        setConfirmLoading(true);
        request(modalTitle === "追加" ? "addUser" : "updateUser", values).then(() => {
            handleCancel();
            setConfirmLoading(false);
            onFinishSearch(searchForm.getFieldsValue())
        })
    };
    const deleteUser = (user_id: number) => {
        setLoading(true);
        request("deleteUser", {
            user_id
        }).then(() => {
            setLoading(false);
            onFinishSearch(searchForm.getFieldsValue())
        })
    }
    const onFinishFormFailed: FormProps<userDataType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onFinishSearch = (values: userDataType) => {
        (values as any).isActive = values.isActive ? 1 : 0;
        request("getUserList", {
            current: tableParams.pagination?.current,
            pageSize: tableParams.pagination?.pageSize,
            ...values
        }).then(res => {
            setData(Array.isArray(res.data) ? res.data : []);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    current: 1,
                    total: res.total
                }
            });
            setLoading(false);
        })
    };
    const searchFormReset = () => {
        searchForm.resetFields();
    }
    const handleTableChange: TableProps<userDataType>['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };
    const fetchData = () => {
        setLoading(true);
        request("getUserList", {
            current: tableParams.pagination?.current,
            pageSize: tableParams.pagination?.pageSize
        }).then(res => {
            setData(Array.isArray(res.data) ? res.data : []);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: res.total
                }
            });
            setLoading(false);
        });
    };
    const avatarOnRemove = (avatar: string) => {
        request("upload-file-delete", {
            avatar
        }).then(res => {
            console.log(res)
        });
    }


    useEffect(() => {
        request("getEducationList").then(res => {
            setEducationList(res.data)
        })
    }, [])
    useEffect(fetchData, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        tableParams?.sortOrder,
        tableParams?.sortField,
        JSON.stringify(tableParams.filters),
    ]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    return (
        <>
            <Button onClick={() => showModal("add")} type="primary">ユーザーを追加</Button>
            <Form form={searchForm} onFinish={onFinishSearch} initialValues={{ isActive: true }} layout="inline"
                  className="table-demo-control-bar" style={{
                    margin: "16px 0",
                    background: "white",
                    padding: "15px",
                    borderRadius: "8px" }}>
                <Form.Item label="名前" name="username">
                    <Input placeholder="名前" allowClear />
                </Form.Item>
                <Form.Item label="性別" name="gender">
                    <Select
                        placeholder="性別"
                        allowClear
                        options={[
                            { value: 'female', label: '女性' },
                            { value: 'male', label: '男性' }
                        ]}
                    />
                </Form.Item>
                <Form.Item label="学歴" name="user_edu">
                    <Select
                        style={{ width: "154px" }}
                        placeholder="学歴"
                        allowClear
                        fieldNames={{
                            label: 'label',
                            value: 'edu_id',
                        }}
                        options={educationList}
                    />
                </Form.Item>
                <Form.Item label="メール" name="user_email">
                    <Input placeholder="メール" allowClear />
                </Form.Item>
                <Form.Item label="状態" name="isActive" valuePropName="checked">
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" iconPosition="end" icon={<SearchOutlined />} htmlType="submit" style={{ marginLeft: "41px" }}>探す</Button>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="button" onClick={ searchFormReset }>リセット</Button>
                </Form.Item>
            </Form>
            <Modal
                title={modalTitle}
                footer={null}
                open={open}
                onCancel={handleCancel}
            >
                <Form
                    name="basic"
                    form={userForm}
                    labelCol={{ span: 5 }}
                    initialValues={{ isActive: true }}
                    onFinish={onFinishForm}
                    onFinishFailed={onFinishFormFailed}
                    autoComplete="off"
                >
                    <Form.Item<userDataType>
                        label="名前"
                        name="username"
                        rules={[{ required: true, message: '名前を入力してください' }]}
                    >
                        <Input allowClear placeholder="名前" />
                    </Form.Item>
                    <Form.Item<userDataType> label="性別" name="gender" rules={[{ required: true, message: '性別を選択してください' }]}>
                        <Select
                            placeholder="性別"
                            allowClear
                            options={[
                                { value: 'female', label: '女性' },
                                { value: 'male', label: '男性' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item<userDataType> label="学歴" name="user_edu" rules={[{ required: true, message: '学歴を選択してください' }]}>
                        <Select
                            placeholder="学歴"
                            allowClear
                            fieldNames={{
                                label: 'label',
                                value: 'edu_id',
                            }}
                            options={educationList}
                        />
                    </Form.Item>
                    <Form.Item<userDataType> label="メール" name="user_email"
                         rules={[{ required: true, message: 'メールを入力してください' }]}>
                        <Input placeholder="メール" allowClear />
                    </Form.Item>
                    <Form.Item label="状態" name="isActive">
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                        />
                    </Form.Item>
                    <Form.Item name="avatar" label="アバター">
                        <>
                            <ImgCrop rotationSlider>
                                <Upload
                                    action="https://www.makotodeveloper.website/shop_sample/upload"
                                    headers={{
                                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                                    }}
                                    listType="picture-circle"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={({ file, fileList: newList }) => {
                                        console.log("newList: ", newList)
                                        if (file.status === 'done' && file.response?.url) {
                                            file.url = file.response.url;
                                        }
                                        setFileList(newList);
                                    }}
                                    onRemove={(file) => {
                                        console.log(file);
                                        if (file.url) {
                                            const filename = file.url.split("/").pop();
                                            if (!filename) return;
                                            avatarOnRemove(file.url)
                                        }

                                        return true;
                                    }}
                                >
                                    { fileList.length < 1 && '+ Upload' }
                                </Upload>
                            </ImgCrop>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: 'none' }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage('')
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </>
                    </Form.Item>
                    <Form.Item name="user_id" style={{ display: 'none' }}>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item label={null}>
                        <Button loading={confirmLoading} type="primary" htmlType="submit" style={{ marginLeft: "89.64px" }}>{modalTitle}</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Table<userDataType>
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