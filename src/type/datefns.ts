export type DateFNSFormat =
  | 'yyyy-MM-dd'
  | 'yyyy-MM-dd HH:mm:ss' // 24 hours
  | 'yyyy-MM-dd HH:mm' // 24 hours
  | 'yyyy-MM-dd HH:mm:ss XXX' // 24 hours with timezone (ex: 2024-12-20 12:00:00 +07:00)
  | 'yyyy-MM-dd hh:mm:ss a' // 12 hours with AM/PM
  | 'yyyy-MM-dd hh:mm:ss a XXX' // 12 hours with AM/PM and timezone (ex: 2024-12-20 02:00:00 PM +07:00)
  | 'dd-MM-yyyy'
  | 'dd-MM-yyyy HH:mm:ss'
  | 'dd-MM-yyyy HH:mm'
  | 'dd-MM-yyyy HH:mm:ss XXX'
  | 'dd-MM-yyyy hh:mm:ss a'
  | 'dd-MM-yyyy hh:mm:ss a XXX'
  | 'MMMM dd, yyyy HH:mm'
  | 'MMM dd, yyyy HH:mm'
  | 'dd/MM/yyyy HH:mm' // 24 hours
  | 'yyyy/MM/dd - HH:mm'
  | 'yyyy/MM/dd-HH:mm'
  | 'dd MMMM yyyy'
  | 'dd MMMM yyyy HH:mm:ss'
  | 'dd MMMM yyyy HH:mm'
  | 'dd MMMM yyyy HH:mm:ss XXX'
  | 'dd MMMM yyyy hh:mm:ss a'
  | 'dd MMMM yyyy hh:mm:ss a XXX'
  | 'dd/MM/yyyy'
  | 'dd/MM/yyyy HH:mm:ss'
  | 'dd/MM/yyyy HH:mm:ss XXX'
  | 'dd/MM/yyyy hh:mm:ss a'
  | 'dd/MM/yyyy hh:mm:ss a XXX'
  | 'yyyy/MM/dd'
  | 'yyyy/MM/dd HH:mm:ss'
  | 'yyyy/MM/dd HH:mm'
  | 'yyyy/MM/dd HH:mm:ss XXX'
  | 'yyyy/MM/dd hh:mm:ss a'
  | 'yyyy/MM/dd hh:mm:ss a XXX'
