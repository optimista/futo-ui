import { map } from '@futo-ui/utils'
import { createRef } from 'react'

const useObjectRefs = fields => (map(fields, () => createRef()));

export default useObjectRefs;
