# Task 57: Price Alerts - Implementation Summary

## Overview
Implemented a comprehensive Price Alerts feature that allows users to set alerts for crop prices and receive notifications when prices reach their target thresholds.

## Features Implemented

### Backend (Task 57.1 & 57.2)

#### 1. Database Model (`backend/src/models/PriceAlert.js`)
- **Fields:**
  - `cropType`: Type of crop to monitor
  - `targetPrice`: Price threshold for alert
  - `alertType`: 'below' or 'above' - trigger when price drops below or rises above target
  - `isActive`: Whether alert is currently active
  - `lastTriggered`: Timestamp of last trigger
  - `location`: Optional location filter for regional prices
  - `notificationMethod`: 'sms', 'push', 'both', or 'in-app'
- **Associations:** Belongs to User
- **Indexes:** On userId+cropType and isActive for performance

#### 2. API Routes (`backend/src/routes/priceAlerts.js`)
- `GET /api/price-alerts` - Get all alerts for user
- `GET /api/price-alerts/active` - Get only active alerts
- `POST /api/price-alerts` - Create new alert
- `GET /api/price-alerts/:id` - Get single alert details
- `PUT /api/price-alerts/:id` - Update alert (price, type, status)
- `DELETE /api/price-alerts/:id` - Delete alert
- `POST /api/price-alerts/check` - Manual trigger to check all alerts
- `GET /api/price-alerts/notifications` - Get triggered alerts for in-app notifications

#### 3. Price Alert Service (`backend/src/services/PriceAlertService.js`)
- **checkAllAlerts()**: Checks all active alerts against current prices
- **checkAlert(alert)**: Checks a single alert
- **getCurrentPrice(cropType, location)**: Gets current price from listings or eNAM data
- **sendNotification(alert, currentPrice)**: Sends notification (logs for MVP, ready for SMS/push integration)
- **formatAlertMessage(alert, currentPrice)**: Formats user-friendly alert messages
- **getTriggeredAlertsForUser(userId)**: Gets recent triggered alerts for in-app display

#### 4. Cron Job (`backend/src/utils/cronJobs.js`)
- Checks all active alerts every hour in production
- Checks every 5 minutes in development mode
- Prevents duplicate notifications within 24 hours
- Logs all check results

#### 5. Validation
- Required fields: cropType, targetPrice, alertType
- Alert type must be 'below' or 'above'
- Target price must be positive
- Proper error messages for all validation failures

### Frontend (Task 57.2)

#### 1. Price Alerts Page (`frontend/src/pages/PriceAlerts.jsx`)
- **Features:**
  - View all price alerts with status indicators
  - Create new alerts with form validation
  - Edit existing alerts inline
  - Delete alerts with confirmation
  - Toggle alerts active/inactive
  - View triggered alert notifications
  - Responsive design for mobile and desktop

- **UI Components:**
  - Alert list with color-coded status (active=green, inactive=gray)
  - Create/Edit form with crop selector, price input, alert type selector
  - Location filter (optional)
  - Notification method selector
  - Recent notifications banner
  - Empty state with helpful message

#### 2. Navigation Integration
- Added "Alerts" link to NavBar (desktop and mobile)
- Icon: Bell (FaBell)
- Positioned between "Saved Searches" and "Settings"

#### 3. Route Configuration
- Route: `/price-alerts`
- Protected route (requires authentication)
- Added to App.jsx routing

## How It Works

### Alert Creation Flow
1. User selects crop type from dropdown
2. User enters target price (₹/quintal)
3. User selects alert type (below/above)
4. Optionally adds location filter
5. Selects notification method
6. System creates alert and activates it

### Alert Checking Flow
1. Cron job runs every hour (or 5 min in dev)
2. Service fetches all active alerts
3. For each alert:
   - Gets current price from recent listings (average of last 20)
   - Falls back to eNAM price if no listings
   - Compares current price to target price
   - Triggers if condition met and not triggered in last 24 hours
4. Sends notification (logs for MVP, ready for SMS/push)
5. Updates lastTriggered timestamp

### Price Calculation
- **Primary Source**: Average of last 20 active listings for the crop
- **Fallback**: Latest eNAM modal price
- **Location Filter**: If specified, only considers listings from that location

### Notification Methods (MVP)
- **in-app**: Displayed in notifications section on Price Alerts page
- **sms**: Placeholder (ready for SMS gateway integration)
- **push**: Placeholder (ready for push notification service)
- **both**: Placeholder (SMS + push)

## Testing

### Test Script (`test-price-alerts.js`)
Comprehensive test suite covering:
1. ✅ Authentication
2. ✅ Create price alert
3. ✅ Get all alerts
4. ✅ Get single alert
5. ✅ Update alert
6. ✅ Get active alerts
7. ✅ Check alerts (manual trigger)
8. ✅ Get notifications
9. ✅ Delete alert
10. ✅ Input validation
11. ✅ Frontend component rendering
12. ✅ Alert type tests (below/above)
13. ✅ Multiple alerts for same crop

### Running Tests
```bash
# Make sure backend is running on port 5000
cd backend
npm run dev

# In another terminal, run tests
node test-price-alerts.js
```

## API Examples

### Create Alert
```bash
curl -X POST http://localhost:5000/api/price-alerts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cropType": "Wheat",
    "targetPrice": 2000,
    "alertType": "below",
    "location": "Mumbai",
    "notificationMethod": "in-app"
  }'
```

### Get All Alerts
```bash
curl http://localhost:5000/api/price-alerts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Alert
```bash
curl -X PUT http://localhost:5000/api/price-alerts/ALERT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetPrice": 2500,
    "isActive": false
  }'
```

### Check Alerts (Manual)
```bash
curl -X POST http://localhost:5000/api/price-alerts/check \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete Alert
```bash
curl -X DELETE http://localhost:5000/api/price-alerts/ALERT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema

```sql
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  crop_type VARCHAR(255) NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  alert_type ENUM('below', 'above') NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP NULL,
  location VARCHAR(255) NULL,
  notification_method ENUM('sms', 'push', 'both', 'in-app') DEFAULT 'in-app',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_crop (user_id, crop_type),
  INDEX idx_active (is_active)
);
```

## Future Enhancements

### Phase 1 (Production Ready)
- [ ] SMS gateway integration (Twilio, AWS SNS)
- [ ] Push notification service (Firebase Cloud Messaging)
- [ ] Email notifications
- [ ] Alert history/logs

### Phase 2 (Advanced Features)
- [ ] Price trend analysis (show if price is trending up/down)
- [ ] Smart alerts (ML-based price predictions)
- [ ] Alert templates (common alert configurations)
- [ ] Bulk alert creation
- [ ] Alert sharing between users
- [ ] Price charts on alert page

### Phase 3 (Enterprise Features)
- [ ] Alert groups/categories
- [ ] Advanced filtering (quality tier, vendor rating)
- [ ] Alert analytics dashboard
- [ ] Export alert history
- [ ] API webhooks for alerts
- [ ] Integration with external price APIs

## Files Created/Modified

### Backend
- ✅ `backend/src/models/PriceAlert.js` (new)
- ✅ `backend/src/routes/priceAlerts.js` (new)
- ✅ `backend/src/services/PriceAlertService.js` (new)
- ✅ `backend/src/utils/cronJobs.js` (new)
- ✅ `backend/src/models/index.js` (modified - added PriceAlert)
- ✅ `backend/src/app.js` (modified - added route and cron initialization)

### Frontend
- ✅ `frontend/src/pages/PriceAlerts.jsx` (new)
- ✅ `frontend/src/App.jsx` (modified - added route)
- ✅ `frontend/src/components/NavBar.jsx` (modified - added nav link)

### Testing & Documentation
- ✅ `test-price-alerts.js` (new)
- ✅ `TASK_57_PRICE_ALERTS_SUMMARY.md` (this file)

## Success Criteria

✅ **Backend:**
- [x] PriceAlert model created with all required fields
- [x] CRUD API endpoints implemented
- [x] Alert checking service with cron job
- [x] Price fetching from listings and eNAM
- [x] Notification system (MVP with logging)
- [x] Input validation and error handling

✅ **Frontend:**
- [x] Price Alerts page with full CRUD UI
- [x] Create/edit alert forms
- [x] Alert list with status indicators
- [x] Toggle active/inactive
- [x] Delete with confirmation
- [x] Notifications display
- [x] Navigation integration
- [x] Responsive design

✅ **Testing:**
- [x] Comprehensive test script
- [x] API endpoint tests
- [x] Validation tests
- [x] Frontend component tests

## Usage Guide

### For Farmers/Vendors

1. **Navigate to Price Alerts**
   - Click "Alerts" in the navigation bar
   - Or go to `/price-alerts`

2. **Create Your First Alert**
   - Click "Create Alert" button
   - Select the crop you want to monitor
   - Enter your target price (₹/quintal)
   - Choose alert type:
     - "Below": Get notified when price drops below target (good for buying)
     - "Above": Get notified when price rises above target (good for selling)
   - Optionally add location filter
   - Click "Create Alert"

3. **Manage Your Alerts**
   - View all alerts on the main page
   - Active alerts are highlighted in green
   - Inactive alerts are grayed out
   - Click "Edit" to modify an alert
   - Click "Pause" to temporarily disable
   - Click "Delete" to remove permanently

4. **Check Notifications**
   - Recent triggered alerts appear at the top
   - Shows current price vs your target
   - Alerts are checked automatically every hour

### For Developers

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Run Tests**
   ```bash
   node test-price-alerts.js
   ```

4. **Check Cron Logs**
   - Watch console for "[CronJobs]" messages
   - Alerts checked every hour (production)
   - Every 5 minutes in development

## Troubleshooting

### Alerts Not Triggering
- Check if alert is active (isActive = true)
- Verify current price data exists for the crop
- Check if alert was triggered in last 24 hours (throttling)
- Look for cron job logs in console

### Price Data Not Found
- Ensure there are active listings for the crop
- Check eNAM price data in database
- Verify crop name matches exactly

### Frontend Not Loading
- Check if backend is running on port 5000
- Verify token is valid
- Check browser console for errors

## Conclusion

Task 57 (Price Alerts) has been successfully implemented with:
- ✅ Complete backend API with CRUD operations
- ✅ Automated alert checking with cron jobs
- ✅ Price fetching from multiple sources
- ✅ Full-featured frontend UI
- ✅ Comprehensive testing suite
- ✅ Documentation and user guide

The feature is production-ready for MVP with in-app notifications. SMS and push notifications are architected and ready for integration when needed.
