import { Button, Space } from 'antd';

function ExampleButton() {
  return (
    <Space>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button danger>Danger</Button>
    </Space>
  );
}

export default ExampleButton;
