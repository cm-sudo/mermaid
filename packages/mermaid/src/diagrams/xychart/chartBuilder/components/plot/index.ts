import {
  XYChartConfig,
  XYChartData,
  Dimension,
  BoundingRect,
  DrawableElem,
  Point,
  OrientationEnum,
  ChartPlotEnum,
} from '../../Interfaces.js';
import { IAxis } from '../axis/index.js';
import { ChartComponent } from '../../Interfaces.js';
import { LinePlot } from './LinePlot.js';
import { PlotBorder } from './PlotBorder.js';
import { BarPlot } from './BarPlot.js';


export interface IPlot extends ChartComponent {
  setAxes(xAxis: IAxis, yAxis: IAxis): void
}

export class Plot implements IPlot {
  private boundingRect: BoundingRect;
  private xAxis?: IAxis;
  private yAxis?: IAxis;

  constructor(
    private chartConfig: XYChartConfig,
    private chartData: XYChartData,
  ) {
    this.boundingRect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }
  setAxes(xAxis: IAxis, yAxis: IAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }
  setBoundingBoxXY(point: Point): void {
    this.boundingRect.x = point.x;
    this.boundingRect.y = point.y;
  }
  calculateSpace(availableSpace: Dimension): Dimension {
    this.boundingRect.width = availableSpace.width;
    this.boundingRect.height = availableSpace.height;

    return {
      width: this.boundingRect.width,
      height: this.boundingRect.height,
    };
  }
  getDrawableElements(): DrawableElem[] {
    if(!(this.xAxis && this.yAxis)) {
      throw Error("Axes must be passed to render Plots");
    }
    const drawableElem: DrawableElem[] = [
      ...new PlotBorder(this.boundingRect, this.chartConfig.chartOrientation).getDrawableElement()
    ];
    for(const plot of this.chartData.plots) {
      switch(plot.type) {
        case ChartPlotEnum.LINE: {
          const linePlot = new LinePlot(plot, this.xAxis, this.yAxis, this.chartConfig.chartOrientation);
          drawableElem.push(...linePlot.getDrawableElement())
        }
        break;
        case ChartPlotEnum.BAR: {
          const barPlot = new BarPlot(plot, this.boundingRect, this.xAxis, this.yAxis, this.chartConfig.chartOrientation)
          drawableElem.push(...barPlot.getDrawableElement());
        }
        break;
      }
    }
    return drawableElem;
  }
}

export function getPlotComponent(
  chartConfig: XYChartConfig,
  chartData: XYChartData,
): IPlot {
  return new Plot(chartConfig, chartData);
}
