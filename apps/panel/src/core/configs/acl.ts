import { AbilityBuilder, AbilityTuple, createMongoAbility, MongoAbility, MongoQuery } from '@casl/ability'
import { UserPermType } from '../contexts/types'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = MongoAbility<AbilityTuple, MongoQuery>

export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
export const defineMultiRules = (permissions: UserPermType[]) => {
  const { can, rules, build } = new AbilityBuilder(createMongoAbility)
  for (const permission of permissions) {
    can(permission.actions, permission.subject)
  }
  return build()
}

export const buildMultiAbility = (permissions: UserPermType[]): AppAbility => {
  return defineMultiRules(permissions)
}

export const buildRoleAbility = (role: string): AppAbility => {
  const { can, build } = new AbilityBuilder(createMongoAbility)
  can('role', role)
  return build()
}
