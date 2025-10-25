-- =====================================================
-- UPDATE QUERIES: Update ALL child rows with parent dimensions
-- This will update cost_center and project for ALL child rows
-- =====================================================

-- 1. Purchase Invoice Items - Update ALL rows
UPDATE `tabPurchase Invoice Item` pi
INNER JOIN `tabPurchase Invoice` p ON pi.parent = p.name
SET 
    pi.cost_center = p.cost_center,
    pi.project = p.project;

-- 2. Sales Invoice Items - Update ALL rows
UPDATE `tabSales Invoice Item` pi
INNER JOIN `tabSales Invoice` p ON pi.parent = p.name
SET 
    pi.cost_center = p.cost_center,
    pi.project = p.project;

-- 3. Stock Entry Details - Update ALL rows (using custom_cost_center from parent)
UPDATE `tabStock Entry Detail` pi
INNER JOIN `tabStock Entry` p ON pi.parent = p.name
SET 
    pi.cost_center = p.custom_cost_center,
    pi.project = p.project;

-- 4. Purchase Receipt Items - Update ALL rows
UPDATE `tabPurchase Receipt Item` pi
INNER JOIN `tabPurchase Receipt` p ON pi.parent = p.name
SET 
    pi.cost_center = p.cost_center,
    pi.project = p.project;

-- 5. Delivery Note Items - Update ALL rows
UPDATE `tabDelivery Note Item` pi
INNER JOIN `tabDelivery Note` p ON pi.parent = p.name
SET 
    pi.cost_center = p.cost_center,
    pi.project = p.project;

-- =====================================================
-- VERIFICATION QUERY: Run after updates to confirm
-- =====================================================
SELECT 'Purchase Invoice' AS doctype, COUNT(DISTINCT p.name) AS remaining_mismatches
FROM `tabPurchase Invoice` p
INNER JOIN `tabPurchase Invoice Item` pi ON pi.parent = p.name
WHERE (pi.cost_center IS NOT NULL AND p.cost_center IS NOT NULL AND pi.cost_center != p.cost_center)
   OR (pi.project IS NOT NULL AND p.project IS NOT NULL AND pi.project != p.project)

UNION ALL

SELECT 'Sales Invoice', COUNT(DISTINCT p.name)
FROM `tabSales Invoice` p
INNER JOIN `tabSales Invoice Item` pi ON pi.parent = p.name
WHERE (pi.cost_center IS NOT NULL AND p.cost_center IS NOT NULL AND pi.cost_center != p.cost_center)
   OR (pi.project IS NOT NULL AND p.project IS NOT NULL AND pi.project != p.project)

UNION ALL

SELECT 'Stock Entry', COUNT(DISTINCT p.name)
FROM `tabStock Entry` p
INNER JOIN `tabStock Entry Detail` pi ON pi.parent = p.name
WHERE (pi.cost_center IS NOT NULL AND p.custom_cost_center IS NOT NULL AND pi.cost_center != p.custom_cost_center)
   OR (pi.project IS NOT NULL AND p.project IS NOT NULL AND pi.project != p.project)

UNION ALL

SELECT 'Purchase Receipt', COUNT(DISTINCT p.name)
FROM `tabPurchase Receipt` p
INNER JOIN `tabPurchase Receipt Item` pi ON pi.parent = p.name
WHERE (pi.cost_center IS NOT NULL AND p.cost_center IS NOT NULL AND pi.cost_center != p.cost_center)
   OR (pi.project IS NOT NULL AND p.project IS NOT NULL AND pi.project != p.project)

UNION ALL

SELECT 'Delivery Note', COUNT(DISTINCT p.name)
FROM `tabDelivery Note` p
INNER JOIN `tabDelivery Note Item` pi ON pi.parent = p.name
WHERE (pi.cost_center IS NOT NULL AND p.cost_center IS NOT NULL AND pi.cost_center != p.cost_center)
   OR (pi.project IS NOT NULL AND p.project IS NOT NULL AND pi.project != p.project);