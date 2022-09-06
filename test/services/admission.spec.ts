import { describe, it, expect } from '@jest/globals'
import 'reflect-metadata'
import { Admission } from '../../src/services/admission'

describe('services/admission', () => {
  it('Should block images on disallow list', async () => {
    const service = new Admission(['allowed'], ['blocked'], false)
    const allow = await service.allowAdmission(['blocked'])
    expect(allow).toBeFalsy()
  })
  it('Should allow images not on disallow list', async () => {
    const service = new Admission(['allowed'], ['blocked'], false)
    const allow = await service.allowAdmission(['allowed'])
    expect(allow).toBeTruthy()
  })
  it('Should only allow images on allow list when in restrictive mode', async () => {
    const service = new Admission(['allowed'], ['blocked'], true)
    const allow = await service.allowAdmission(['no-on-list'])
    expect(allow).toBeFalsy()
  })
})
