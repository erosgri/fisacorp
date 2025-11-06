import type { ComponentProps } from 'react';

import CreateOrder from './create';

export default function EditOrder(props: ComponentProps<typeof CreateOrder>) {
    return <CreateOrder {...props} />;
}



