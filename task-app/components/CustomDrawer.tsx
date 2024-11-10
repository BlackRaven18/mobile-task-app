import * as React from 'react';
import { Drawer } from 'react-native-paper';

const CustomDrawer = () => {
  const [active, setActive] = React.useState('');

  return (
    <Drawer.CollapsedItem active={active === 'first'}>
        <Drawer.Section title="Some title">
        <Drawer.Item
            label="First Item"
            active={active === 'first'}
            onPress={() => setActive('first')}
        />
        <Drawer.Item
            label="Second Item"
            active={active === 'second'}
            onPress={() => setActive('second')}
        />
        </Drawer.Section>
    </Drawer.CollapsedItem>
  );
};

export default CustomDrawer;