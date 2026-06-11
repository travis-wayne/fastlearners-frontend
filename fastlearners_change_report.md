# Fastlearners API Documentation Change Report

Checked: 2026-06-11 08:28:08 +01:00

## Summary

- Previous pages: 37
- Current pages: 39
- Added pages: 2
- Removed pages: 0
- Previous endpoints: 113
- Current endpoints: 124
- Added endpoints: 13
- Removed endpoints: 2

## Added Pages
- [student/motd](https://api.fastlearnersapp.com/public/api-doc/student/motd)
- [superadmin/motds](https://api.fastlearnersapp.com/public/api-doc/superadmin/motds)

## Removed Pages
- None

## Added Endpoints
- `GET /api/v1/guardian/children/2/view` - Guardian Management / View Child Details
- `GET /api/v1/guardian/children/lesson/1/2/view-lesson-details` - Guardian Management / View Child Lesson Details
- `GET /api/v1/guardian/children/subject/2/4/4/view-subject-details` - Guardian Management / View Child Subject Details
- `GET /api/v1/guardian/children` - Guardian Management / View Children
- `GET /api/v1/motd` - MOTD / View MOTD
- `POST /api/v1/superadmin/motds/create` - MOTD Management / Create MOTD
- `DELETE /api/v1/superadmin/motds/3/delete` - MOTD Management / Delete MOTD
- `GET /api/v1/superadmin/motds/2/view` - MOTD Management / Get MOTD Detail
- `PUT /api/v1/superadmin/motds/4/update` - MOTD Management / Update MOTD
- `POST /api/v1/superadmin/motds/2/update-status` - MOTD Management / Update MOTD Status
- `GET /api/v1/superadmin/motds` - MOTD Management / View MOTDs
- `GET /api/v1/superadmin/tickets/5/view` - Ticket Management / View Ticket Details
- `GET /api/v1/tickets/5/view` - Ticket Management / View Ticket Details

## Removed Endpoints
- `GET /api/v1/superadmin/tickets/2/view` - Ticket Management / View Ticket
- `GET /api/v1/tickets/2/view` - Ticket Management / View Ticket
