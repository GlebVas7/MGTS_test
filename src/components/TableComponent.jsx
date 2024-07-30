import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Form, Input, Menu, Space, Table, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                    width:"100px"
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `заполните поле`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    width: 100,
                    paddingInlineEnd: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const TableComponent = () => {
    const items = [
        { key: 'yes', label: 'да' },
        { key: 'no', label: 'нет' },
    ];

    const [dataSource, setDataSource] = useState([
        {
            key: '0',
            sector: 'Test 0',
            typeOfBSAntennas: '32',
            quantity: 'Test 0',
            azimuth: 'Test 0',
            angleOfInclination: 'Test 0',
            availabilityOfRet: 'no',
            typeOfRemoteUnit: 'Test 0',
        },
        {
            key: '1',
            sector: 'Test 1',
            typeOfBSAntennas: '32',
            quantity: 'Test 1',
            azimuth: 'Test 1',
            angleOfInclination: 'Test 1',
            availabilityOfRet: 'no',
            typeOfRemoteUnit: 'Test 1',

        },
    ]);

    const [count, setCount] = useState(2);

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const handleMenuClick = (record, e) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => record.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            availabilityOfRet: e.key,
        });
        setDataSource(newData);
    };

    const defaultColumns = [
        {
            title: 'Сектор',
            dataIndex: 'sector',
            key: 'sector',
            editable: true,
        },
        {
            title: 'Тип антенн БС',
            dataIndex: 'typeOfBSAntennas',
            key: 'typeOfBSAntennas',
            editable: true,
        },
        {
            title: 'Количество',
            dataIndex: 'quantity',
            key: 'quantity',
            editable: true,
        },
        {
            title: 'Азимут',
            dataIndex: 'azimuth',
            key: 'azimuth',
            editable: true,
        },
        {
            title: 'Угол наклона',
            dataIndex: 'angleOfInclination',
            key: 'angleOfInclination',
            editable: true,
        },
        {
            title: 'наличие Ret',
            dataIndex: 'availabilityOfRet',
            key: 'availabilityOfRet',
            render: (_, record) => (
                <Dropdown
                    overlay={
                        <Menu
                            items={items}
                            selectable
                            defaultSelectedKeys={[record.availabilityOfRet]}
                            onClick={(e) => handleMenuClick(record, e)}
                        />
                    }
                >
                    <Typography.Link>
                        <Space>
                            {record.availabilityOfRet === 'yes' ? 'да' : 'нет'}
                            <DownOutlined />
                        </Space>
                    </Typography.Link>
                </Dropdown>
            ),
        },
        {
            title: 'Тип выносного блока',
            dataIndex: 'typeOfRemoteUnit',
            key: 'typeOfRemoteUnit',
            editable: true,
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Button type="primary" onClick={() => handleDelete(record.key)} danger ghost>
                        <a>Delete</a>
                    </Button>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const newData = {
            key: count,
            sector: `Test  ${count}`,
            typeOfBSAntennas: '32',
            quantity: `Test ${count}`,
            azimuth: `Test ${count}`,
            angleOfInclination: `Test ${count}`,
            availabilityOfRet: 'no',
            typeOfRemoteUnit: `Test ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    return (
        <div style={{
            width: '100%',
            height: '100%',
            marginLeft: "15%",
        }}>

            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                style={{ textAlign: 'center' }}
            />
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    marginTop: 16,
                    backgroundColor: '#45d900',
                    fontSize: "20px",

                }}
            >
                +
            </Button>
        </div>
    );
};

export default TableComponent;
