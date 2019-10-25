import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class detailPlugIn extends shtBillPlugIn {
  constructor(options) {
    super(options);
  }
  onInitUiModel(args) {
    let t = this;
    args.tagData = {
      crumb: [{ a: '帮助中心', b: { path: '/personal/problem' } }, { a: '帮助明细' }],
      problem: ''
    }
    return super.onInitUiModel(args);
  }
  onAfterLoadModelData(args) {
    this.getData();
    return super.onAfterLoadModelData(args);
  }
}