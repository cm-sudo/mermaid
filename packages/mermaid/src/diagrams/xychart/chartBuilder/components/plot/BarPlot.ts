import {
  BarPlotData,
  BoundingRect,
  DrawableElem,
  OrientationEnum,
  SimplePlotDataType,
} from '../../Interfaces.js';
import { IAxis } from '../axis/index.js';

export class BarPlot {
  constructor(
    private barData: BarPlotData,
    private boundingRect: BoundingRect,
    private xAxis: IAxis,
    private yAxis: IAxis,
    private orientation: OrientationEnum
  ) {}

  getDrawableElement(): DrawableElem[] {
    const finalData: [number, number][] = this.barData.data.map((d) => [
      this.xAxis.getScaleValue(d[0]),
      this.yAxis.getScaleValue(d[1]),
    ]);

    const barPaddingPercent = 5;

    const barWidth =
      Math.min(this.xAxis.getTickInnerPadding(), this.xAxis.getTickDistance()) *
      (1 - barPaddingPercent / 100);
    const barWidthHalf = barWidth / 2;

    if (this.orientation === OrientationEnum.HORIZONTAL) {
      return [
        {
          groupTexts: ['plot', 'bar-plot'],
          type: 'rect',
          data: finalData.map((data) => ({
            x: this.boundingRect.x,
            y: data[0] - barWidthHalf,
            height: barWidth,
            width: data[1] - this.boundingRect.x,
            fill: this.barData.fill,
            strokeWidth: 0,
            strokeFill: this.barData.fill,
          })),
        },
      ];
    } else {
      return [
        {
          groupTexts: ['plot', 'bar-plot'],
          type: 'rect',
          data: finalData.map((data) => ({
            x: data[0] - barWidthHalf,
            y: data[1],
            width: barWidth,
            height: this.boundingRect.y + this.boundingRect.height - data[1],
            fill: this.barData.fill,
            strokeWidth: 0,
            strokeFill: this.barData.fill,
          })),
        },
      ];
    }
  }
}
