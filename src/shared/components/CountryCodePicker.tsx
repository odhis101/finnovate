import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../theme';

export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  placeholder: string;
}

const countries: Country[] = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', dialCode: '+93', placeholder: '70 123 4567' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', dialCode: '+355', placeholder: '67 212 3456' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213', placeholder: '551 23 45 67' },
  { code: 'AS', name: 'American Samoa', flag: '🇦🇸', dialCode: '+1684', placeholder: '733 1234' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩', dialCode: '+376', placeholder: '312 345' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', dialCode: '+244', placeholder: '923 123 456' },
  { code: 'AI', name: 'Anguilla', flag: '🇦🇮', dialCode: '+1264', placeholder: '235 1234' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬', dialCode: '+1268', placeholder: '464 1234' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', placeholder: '11 2345 6789' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', dialCode: '+374', placeholder: '77 123456' },
  { code: 'AW', name: 'Aruba', flag: '🇦🇼', dialCode: '+297', placeholder: '560 1234' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', placeholder: '412 345 678' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', placeholder: '664 123456' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', dialCode: '+994', placeholder: '40 123 45 67' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸', dialCode: '+1242', placeholder: '359 1234' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', placeholder: '3600 1234' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', placeholder: '1812 345678' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', dialCode: '+1246', placeholder: '250 1234' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', dialCode: '+375', placeholder: '29 123 45 67' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', placeholder: '470 12 34 56' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿', dialCode: '+501', placeholder: '622 1234' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', dialCode: '+229', placeholder: '90 01 12 34' },
  { code: 'BM', name: 'Bermuda', flag: '🇧🇲', dialCode: '+1441', placeholder: '370 1234' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹', dialCode: '+975', placeholder: '17 12 34 56' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', dialCode: '+591', placeholder: '71234567' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', dialCode: '+387', placeholder: '61 123 456' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', dialCode: '+267', placeholder: '71 123 456' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', placeholder: '11 91234 5678' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', dialCode: '+673', placeholder: '712 3456' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', dialCode: '+359', placeholder: '48 123 456' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226', placeholder: '70 12 34 56' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', dialCode: '+257', placeholder: '79 56 12 34' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', dialCode: '+855', placeholder: '91 234 567' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237', placeholder: '6 71 23 45 67' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', placeholder: '506 234 5678' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻', dialCode: '+238', placeholder: '991 12 34' },
  { code: 'KY', name: 'Cayman Islands', flag: '🇰🇾', dialCode: '+1345', placeholder: '323 1234' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', dialCode: '+236', placeholder: '70 01 23 45' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', dialCode: '+235', placeholder: '63 01 23 45' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56', placeholder: '9 6123 4567' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86', placeholder: '131 2345 6789' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57', placeholder: '321 1234567' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲', dialCode: '+269', placeholder: '321 23 45' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', dialCode: '+242', placeholder: '06 123 4567' },
  { code: 'CD', name: 'Congo (DRC)', flag: '🇨🇩', dialCode: '+243', placeholder: '991 234 567' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', dialCode: '+506', placeholder: '8312 3456' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', dialCode: '+225', placeholder: '01 23 45 67' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', dialCode: '+385', placeholder: '91 234 5678' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', dialCode: '+53', placeholder: '5 1234567' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357', placeholder: '96 123456' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420', placeholder: '601 123 456' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45', placeholder: '32 12 34 56' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dialCode: '+253', placeholder: '77 83 10 01' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲', dialCode: '+1767', placeholder: '225 1234' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', dialCode: '+1809', placeholder: '234 5678' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', dialCode: '+593', placeholder: '99 123 4567' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', placeholder: '100 123 4567' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', dialCode: '+503', placeholder: '7012 3456' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', dialCode: '+240', placeholder: '222 123 456' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', dialCode: '+291', placeholder: '7 123 456' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', dialCode: '+372', placeholder: '5123 4567' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251', placeholder: '91 123 4567' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', dialCode: '+679', placeholder: '701 2345' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358', placeholder: '41 2345678' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', placeholder: '6 12 34 56 78' },
  { code: 'GF', name: 'French Guiana', flag: '🇬🇫', dialCode: '+594', placeholder: '694 20 12 34' },
  { code: 'PF', name: 'French Polynesia', flag: '🇵🇫', dialCode: '+689', placeholder: '87 12 34 56' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241', placeholder: '06 03 12 34' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', dialCode: '+220', placeholder: '301 2345' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', dialCode: '+995', placeholder: '555 12 34 56' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', placeholder: '1512 3456789' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233', placeholder: '23 123 4567' },
  { code: 'GI', name: 'Gibraltar', flag: '🇬🇮', dialCode: '+350', placeholder: '57123456' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30', placeholder: '691 234 5678' },
  { code: 'GL', name: 'Greenland', flag: '🇬🇱', dialCode: '+299', placeholder: '22 12 34' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩', dialCode: '+1473', placeholder: '403 1234' },
  { code: 'GP', name: 'Guadeloupe', flag: '🇬🇵', dialCode: '+590', placeholder: '690 30 12 34' },
  { code: 'GU', name: 'Guam', flag: '🇬🇺', dialCode: '+1671', placeholder: '300 1234' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', dialCode: '+502', placeholder: '5123 4567' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', dialCode: '+224', placeholder: '601 12 34 56' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼', dialCode: '+245', placeholder: '955 012 345' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', dialCode: '+592', placeholder: '609 1234' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹', dialCode: '+509', placeholder: '34 10 1234' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', dialCode: '+504', placeholder: '9123 4567' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852', placeholder: '5123 4567' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36', placeholder: '20 123 4567' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', dialCode: '+354', placeholder: '611 1234' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', placeholder: '81234 56789' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', placeholder: '812 345 6789' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', dialCode: '+98', placeholder: '912 345 6789' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', dialCode: '+964', placeholder: '791 234 5678' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', placeholder: '85 012 3456' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972', placeholder: '50 123 4567' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', placeholder: '312 345 6789' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', dialCode: '+1876', placeholder: '210 1234' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', placeholder: '90 1234 5678' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962', placeholder: '7 9012 3456' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7', placeholder: '771 000 9998' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', placeholder: '712 345678' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮', dialCode: '+686', placeholder: '72012345' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', placeholder: '500 12345' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', dialCode: '+996', placeholder: '700 123 456' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', dialCode: '+856', placeholder: '20 23 123 456' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', dialCode: '+371', placeholder: '21 234 567' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961', placeholder: '71 123 456' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266', placeholder: '5012 3456' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', dialCode: '+231', placeholder: '77 012 3456' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', dialCode: '+218', placeholder: '91 2345678' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', dialCode: '+423', placeholder: '660 234 567' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', dialCode: '+370', placeholder: '612 34567' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352', placeholder: '628 123 456' },
  { code: 'MO', name: 'Macau', flag: '🇲🇴', dialCode: '+853', placeholder: '6612 3456' },
  { code: 'MK', name: 'Macedonia', flag: '🇲🇰', dialCode: '+389', placeholder: '72 345 678' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261', placeholder: '32 12 345 67' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265', placeholder: '991 23 45 67' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', placeholder: '12 345 6789' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', dialCode: '+960', placeholder: '771 2345' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223', placeholder: '65 01 23 45' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', dialCode: '+356', placeholder: '9696 1234' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭', dialCode: '+692', placeholder: '235 1234' },
  { code: 'MQ', name: 'Martinique', flag: '🇲🇶', dialCode: '+596', placeholder: '696 20 12 34' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', dialCode: '+222', placeholder: '22 12 34 56' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230', placeholder: '5251 2345' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', placeholder: '222 123 4567' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲', dialCode: '+691', placeholder: '350 1234' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', dialCode: '+373', placeholder: '621 12 345' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', dialCode: '+377', placeholder: '6 12 34 56 78' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', dialCode: '+976', placeholder: '8812 3456' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', dialCode: '+382', placeholder: '67 622 901' },
  { code: 'MS', name: 'Montserrat', flag: '🇲🇸', dialCode: '+1664', placeholder: '492 1234' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212', placeholder: '650 123456' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258', placeholder: '82 123 4567' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', dialCode: '+95', placeholder: '9 212 3456' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', dialCode: '+264', placeholder: '81 123 4567' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷', dialCode: '+674', placeholder: '555 1234' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', dialCode: '+977', placeholder: '984 1234567' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', placeholder: '6 12345678' },
  { code: 'NC', name: 'New Caledonia', flag: '🇳🇨', dialCode: '+687', placeholder: '75 12 34' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', placeholder: '21 123 4567' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', dialCode: '+505', placeholder: '8123 4567' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227', placeholder: '93 12 34 56' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', placeholder: '802 123 4567' },
  { code: 'KP', name: 'North Korea', flag: '🇰🇵', dialCode: '+850', placeholder: '192 123 4567' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47', placeholder: '406 12 345' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', placeholder: '9212 3456' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', placeholder: '301 2345678' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼', dialCode: '+680', placeholder: '620 1234' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸', dialCode: '+970', placeholder: '599 123 456' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', dialCode: '+507', placeholder: '6123 4567' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', dialCode: '+675', placeholder: '7012 3456' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', dialCode: '+595', placeholder: '961 123456' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51', placeholder: '912 345 678' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', placeholder: '905 123 4567' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', placeholder: '512 345 678' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', placeholder: '912 345 678' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', dialCode: '+1787', placeholder: '234 5678' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', placeholder: '3312 3456' },
  { code: 'RE', name: 'Réunion', flag: '🇷🇪', dialCode: '+262', placeholder: '692 12 34 56' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40', placeholder: '712 034 567' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7', placeholder: '912 345 67 89' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250', placeholder: '720 123 456' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸', dialCode: '+685', placeholder: '72 12345' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲', dialCode: '+378', placeholder: '66 66 12 12' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', placeholder: '50 123 4567' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221', placeholder: '70 123 45 67' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', dialCode: '+381', placeholder: '60 1234567' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', dialCode: '+248', placeholder: '2 510 123' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232', placeholder: '25 123456' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', placeholder: '8123 4567' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', dialCode: '+421', placeholder: '912 123 456' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', dialCode: '+386', placeholder: '31 234 567' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧', dialCode: '+677', placeholder: '74 21234' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', dialCode: '+252', placeholder: '7 1123456' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', placeholder: '71 123 4567' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82', placeholder: '10 1234 5678' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸', dialCode: '+211', placeholder: '977 123 456' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', placeholder: '612 34 56 78' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94', placeholder: '71 234 5678' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', dialCode: '+249', placeholder: '91 123 1234' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷', dialCode: '+597', placeholder: '741 2345' },
  { code: 'SZ', name: 'Swaziland', flag: '🇸🇿', dialCode: '+268', placeholder: '7612 3456' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', placeholder: '70 123 45 67' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', placeholder: '78 123 45 67' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', dialCode: '+963', placeholder: '944 567 890' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886', placeholder: '912 345 678' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', dialCode: '+992', placeholder: '917 12 3456' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255', placeholder: '621 234 567' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66', placeholder: '81 234 5678' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228', placeholder: '90 11 23 45' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴', dialCode: '+676', placeholder: '771 5123' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', dialCode: '+1868', placeholder: '291 1234' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216', placeholder: '20 123 456' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90', placeholder: '501 234 5678' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', dialCode: '+993', placeholder: '66 123456' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻', dialCode: '+688', placeholder: '901234' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256', placeholder: '712 345678' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380', placeholder: '50 123 4567' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', placeholder: '50 123 4567' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', placeholder: '7400 123456' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', placeholder: '201 555 0123' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598', placeholder: '94 231 234' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', dialCode: '+998', placeholder: '91 234 56 78' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', dialCode: '+678', placeholder: '591 2345' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58', placeholder: '412 1234567' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', placeholder: '91 234 56 78' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', dialCode: '+967', placeholder: '712 345 678' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', dialCode: '+260', placeholder: '95 5123456' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263', placeholder: '71 234 5678' },
];

interface CountryCodePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectCountry: (country: Country) => void;
  selectedCountry?: Country;
}

export const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  visible,
  onClose,
  onSelectCountry,
  selectedCountry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
  );

  const handleSelectCountry = (country: Country) => {
    onSelectCountry(country);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Country</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search country or code"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView style={styles.countriesList} showsVerticalScrollIndicator={false}>
            {filteredCountries.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={[
                  styles.countryItem,
                  selectedCountry?.code === country.code && styles.countryItemSelected,
                ]}
                onPress={() => handleSelectCountry(country)}
              >
                <View style={styles.countryLeft}>
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={styles.countryName}>{country.name}</Text>
                </View>
                <Text style={styles.countryDialCode}>{country.dialCode}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: '400',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Manrope_400Regular',
  },
  countriesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  countryItemSelected: {
    backgroundColor: '#F0E6F6',
    borderRadius: 8,
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryName: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 16,
    color: '#111827',
  },
  countryDialCode: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 16,
    color: '#6B7280',
  },
});
