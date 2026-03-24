declare module 'lunar-javascript' {
  export class Solar {
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): Solar
    getLunar(): Lunar
  }

  export class Lunar {
    getYear(): number
    getMonth(): number
    getDay(): number
    isLeap(): boolean
    getYearInGanZhi(): string
    getMonthInGanZhi(): string
    getDayInGanZhi(): string
    getDayGan(): string
    getDayZhi(): string
  }
}
