import DashboardController from './DashboardController'
import OrderController from './OrderController'
import StockController from './StockController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
OrderController: Object.assign(OrderController, OrderController),
StockController: Object.assign(StockController, StockController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers