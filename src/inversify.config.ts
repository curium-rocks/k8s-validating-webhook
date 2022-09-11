import 'reflect-metadata'
import { Container, interfaces } from 'inversify'
import { TYPES } from './types'
import { IKubernetes, Kubernetes } from './services/kubernetes'
import { CoreV1Api, KubeConfig } from '@kubernetes/client-node'
import { K8sClientBuilder } from './entities/kube'
import { Admission, IAdmission } from './services/admission'
import config from 'config'

const appContainer = new Container()

appContainer.bind<IKubernetes>(TYPES.Services.Kubernetes).to(Kubernetes)
appContainer.bind<IAdmission>(TYPES.Services.Admission).to(Admission)

appContainer.bind<KubeConfig>(TYPES.K8S.Config).toDynamicValue((context: interfaces.Context) => {
  const config = new KubeConfig()
  config.loadFromDefault()
  return config
})
appContainer.bind<CoreV1Api>(TYPES.K8S.CoreApi).toDynamicValue((context: interfaces.Context) => {
  const builder = new K8sClientBuilder(CoreV1Api)
  return builder.buildClient(context.container.get<KubeConfig>(TYPES.K8S.Config)) as CoreV1Api
})
appContainer.bind<string[]>(TYPES.Config.AllowedList).toConstantValue(config.get<string[]>('imageAcl.allowed'))
appContainer.bind<string[]>(TYPES.Config.BlockedList).toConstantValue(config.get<string[]>('imageAcl.blocked'))
appContainer.bind<boolean>(TYPES.Config.StrictMode).toConstantValue(config.get<boolean>('imageAcl.strictMode'))
appContainer.bind<boolean>(TYPES.Config.TLSEnabled).toConstantValue(config.get<boolean>('tls.enabled'))
appContainer.bind<string>(TYPES.Config.TLSKeyPath).toConstantValue(config.get<string>('tls.keyPath'))
appContainer.bind<string>(TYPES.Config.TLSCertPath).toConstantValue(config.get<string>('tls.certPath'))

export { appContainer }
