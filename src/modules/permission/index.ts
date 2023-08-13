import { AccessControl } from "accesscontrol"

const grantsObject = {
  admin: {
    workspace: {
      "create:any": ["*"],
      "read:any": ["*"],
    },
  },
}

const ac = new AccessControl(grantsObject)

const per = ac.can('admin').readAny('profile')
