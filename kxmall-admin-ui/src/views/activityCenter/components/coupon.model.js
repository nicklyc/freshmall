export class Sku {
  constructor(raw = {}) {
    this.id = raw.id || ''
    this.skuList = raw.skuList || [{}]
    this.spuId = raw.spuId || ''
    this.discountPrice = raw.discountPrice || 0
    this.limitNum = raw.limitNum || 0
    this.barCode = this.skuList[0].barCode || ''
    this.name = raw.name || ''
    this.title = raw.title || ''
    this.skuId = this.skuList[0].id
    this.couponId = raw.couponId
    this.categorySku = raw.categorySku
  }
}

export default class DialogData {
  constructor(raw = {}) {
    /* 通用字段 */
    this.id = raw.id || ''
    this.title = raw.title || ''
    // 1优惠券 2抢购券
    this.type = raw.type || 1
    this.description = raw.description || ''
    this.days = raw.days || ''
    this.gmtStart = raw.gmtStart || ''
    this.gmtEnd = raw.gmtEnd || ''
    // 全场通用则为0
    this.categoryId = raw.categoryId || 0

    /* 优惠券专用字段 */
    // 1满减券
    this.discountType = raw.discountType || 1
    // 满减金额
    this.discount = raw.discount || ''
    // 最低消费
    this.min = raw.min || ''
    this.status = raw.status || 1
    this.categoryTitle = raw.categoryTitle || ''

    /* 抢购券专用字段 */
    this.chooseOne = raw.chooseOne || false
    this.couponSkuDoList = ((raw.couponSkuDoList) || [{}]).map(a => new Sku(a))

    /* 前端专用字段 */
    // 有效期 1启用days；2启用gtmStart和gtmEnd
    this.effectiveTime = this.gmtStart && this.gmtEnd ? 2 : 1
    // 1全场 2指定分类 3指定商品（仅前端使用）
    switch (this.type) {
      case 1:
        this.range = Number(this.categoryId) === 0 ? 1 : 2
        break
      case 2:
        this.range = !this.couponSkuDoList.length ? 1 : 3
        break
    }
  }

  get hasSku() {
    return !!this.couponSkuDoList[0].skuId
  }

  getBasicType() {
    return {
      id: this.id,
      title: this.title,
      type: this.type,
      description: this.description,
      days: Number(this.effectiveTime) === 1 ? this.days : undefined,
      gmtStart: Number(this.effectiveTime) === 2 ? new Date(this.gmtStart).getTime() : undefined,
      gmtEnd: Number(this.effectiveTime) === 2 ? new Date(this.gmtEnd).getTime() : undefined,
      categoryId: Number(this.range) === 1 ? 0 : (Number(this.range) === 3 ? null : this.categoryId)
    }
  }

  // 获取优惠券字段
  getType1() {
    return Object.assign(this.getBasicType(), {
      discountType: this.discountType,
      discount: this.discount,
      min: this.min,
      status: this.status,
      categoryTitle: this.categoryTitle
    })
  }

  getType2() {
    return Object.assign(this.getBasicType(), {
      chooseOne: this.chooseOne,
      couponSkuDoList: Number(this.range) === 3 ? this.couponSkuDoList.map(coup => Object.assign({}, coup, {
        discountPrice: coup.discountPrice * 100
      })) : []
    })
  }

  getType(value) {
    return this.type === 1 ? this.getType1() : this.getType2()
  }
}
